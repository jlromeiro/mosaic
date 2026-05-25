import io
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
from PIL import Image, ImageOps

# Matcher híbrido — testa 4 combinações pra ser robusto a uploads variados:
#
#   (color BGR, grayscale)  x  (square forced, aspect preserved)
#
# Cada combinação tem força e fraqueza:
# - color: distingue logos com mesma forma mas cor diferente; mas piora com
#   compressão JPEG agressiva ou variação de brilho
# - grayscale: estável contra compressão/brilho; pode confundir logos com
#   mesma silhueta
# - square: célula do mosaico Solana é quadrada → resize quadrado bate
#   1:1, mesmo com upload retangular; mas distorce logos não-quadradas
# - aspect: preserva proporção original do upload; melhor pra logos com
#   texto/badge mas pode subdimensionar pra célula quadrada
#
# Pegamos o best entre os 4 modos, mais a segunda melhor posição NO MESMO
# scan vencedor (NMS) pra medir ambiguidade. found=True só com confidence
# alta E margem clara — evita aceitar candidatos ambíguos como vitória.

SQUARE_SIZES = list(range(22, 76, 4))           # 14 templates 22..74 px
ASPECT_SCALES = np.linspace(0.18, 1.20, 18)     # 18 scales 0.18..1.20
MIN_CONFIDENCE = 0.50
# Margin pro segundo melhor é exposto no response (debug/info) mas não
# entra no critério found — o threshold simples de confidence cobre bem
# os casos reais. Checar margin tava marcando matches de 78% como
# "approximated" quando o segundo melhor era também alto (logos similares
# no mosaico), confundindo o usuário.


class LogoMatcher:
    def __init__(self, mosaic_path: Path):
        img = cv2.imread(str(mosaic_path), cv2.IMREAD_COLOR)
        if img is None:
            raise RuntimeError(f"Could not load mosaic at {mosaic_path}")
        self.mosaic_bgr = img
        self.mosaic_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        self.height, self.width = img.shape[:2]

    def find(self, logo_bytes: bytes) -> dict:
        # Pillow respeita o EXIF orientation (cv2.imdecode ignora). Sem isso,
        # fotos do celular tiradas em paisagem/cabeça-pra-baixo chegam ao
        # matcher rotacionadas — confidence colapsa. Aplicamos exif_transpose
        # antes de qualquer outro pipeline.
        exif_orientation = self._decode_with_exif(logo_bytes)
        if exif_orientation is None:
            return {"found": False, "confidence": 0.0, "reason": "decode_failed"}
        raw, exif_tag = exif_orientation

        logo_bgr = self._prepare_logo(raw)
        logo_gray = cv2.cvtColor(logo_bgr, cv2.COLOR_BGR2GRAY)
        h, w = logo_bgr.shape[:2]

        # Pass 1: encontrar o melhor (modo, tamanho, posição) sem guardar
        # os result arrays (memória).
        best: Optional[dict] = None
        for use_color in (True, False):
            for use_square in (True, False):
                dims = self._build_dims(w, h, use_square)
                local_best = self._scan(logo_bgr if use_color else logo_gray,
                                         use_color, dims)
                if not local_best:
                    continue
                local_best["method"] = (
                    f"{'color' if use_color else 'gray'}_"
                    f"{'square' if use_square else 'aspect'}"
                )
                if best is None or local_best["confidence"] > best["confidence"]:
                    best = local_best

        if best is None:
            return {"found": False, "confidence": 0.0, "reason": "no_candidates"}

        # Pass 2: re-roda o método vencedor com o tamanho vencedor pra
        # medir o segundo melhor pico (ambiguidade).
        margin, second = self._second_peak(logo_bgr, logo_gray, best)

        position = {
            "x": int(best["x"]),
            "y": int(best["y"]),
            "width": int(best["w"]),
            "height": int(best["h"]),
            "centerX": int(best["x"] + best["w"] / 2),
            "centerY": int(best["y"] + best["h"] / 2),
        }

        confident = best["confidence"] >= MIN_CONFIDENCE

        return {
            "found": confident,
            "confidence": round(best["confidence"], 4),
            "margin": round(margin, 4),
            "second_best_confidence": round(second, 4),
            "method": best["method"],
            "exif_orientation": exif_tag,
            "position": position,
            "mosaic": {"width": self.width, "height": self.height},
        }

    # ---------- helpers ----------

    def _decode_with_exif(
        self, logo_bytes: bytes
    ) -> Optional[tuple[np.ndarray, int]]:
        """Decode bytes preservando EXIF orientation. Retorna (np.ndarray, exif_tag)
        ou None se nenhum decoder reconhecer.

        np.ndarray vem em formato BGR ou BGRA (compatível com pipeline atual);
        exif_tag é o valor da Orientation tag (1=normal, 3=180°, 6=90° CW, 8=270° CW,
        ou 0 se sem EXIF / não disponível)."""
        try:
            with Image.open(io.BytesIO(logo_bytes)) as pil_img:
                exif_tag = 0
                try:
                    exif = pil_img.getexif()
                    if exif:
                        exif_tag = int(exif.get(274, 0) or 0)
                except Exception:
                    exif_tag = 0

                rotated = ImageOps.exif_transpose(pil_img)
                mode = rotated.mode
                if mode == "RGBA":
                    arr = np.array(rotated)
                    bgr = cv2.cvtColor(arr, cv2.COLOR_RGBA2BGRA)
                elif mode == "RGB":
                    arr = np.array(rotated)
                    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
                elif mode == "L":
                    arr = np.array(rotated)
                    bgr = cv2.cvtColor(arr, cv2.COLOR_GRAY2BGR)
                else:
                    rotated = rotated.convert("RGB")
                    arr = np.array(rotated)
                    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
                return bgr, exif_tag
        except Exception:
            # Fallback: cv2.imdecode pro caso de formato exótico que Pillow
            # não abre (ex: alguns AVIF/HEIC sem plugin).
            arr = np.frombuffer(logo_bytes, dtype=np.uint8)
            decoded = cv2.imdecode(arr, cv2.IMREAD_UNCHANGED)
            if decoded is None:
                return None
            return decoded, 0

    def _prepare_logo(self, raw: np.ndarray) -> np.ndarray:
        """Decode → BGR 3-channel. Auto-crop bordas:
        - PNG com alpha: bounding box de pixels não-transparentes
        - JPG/PNG sem alpha: bounding box de pixels não-pretos (fundo
          preto é a maioria dos casos em logos de hackathon Solana)

        O auto-crop só é aplicado quando reduz a área em >= 20% — evita
        ativar em imagens já bem cropadas ou onde fundo preto é parte
        intencional do design."""
        if raw.ndim == 2:
            bgr = cv2.cvtColor(raw, cv2.COLOR_GRAY2BGR)
            return self._autocrop_dark_bg(bgr)
        if raw.shape[2] == 4:
            alpha = raw[:, :, 3]
            mask = alpha > 20
            if mask.any():
                ys, xs = np.where(mask)
                y0, y1 = int(ys.min()), int(ys.max()) + 1
                x0, x1 = int(xs.min()), int(xs.max()) + 1
                cropped = raw[y0:y1, x0:x1]
                bgr = cropped[:, :, :3].astype(np.float32)
                a = cropped[:, :, 3:4].astype(np.float32) / 255.0
                composed = (bgr * a).astype(np.uint8)
                return self._autocrop_dark_bg(composed)
            return self._autocrop_dark_bg(raw[:, :, :3])
        return self._autocrop_dark_bg(raw)

    @staticmethod
    def _autocrop_dark_bg(bgr: np.ndarray) -> np.ndarray:
        """Corta moldura preta ao redor da logo. Ativa apenas se o crop
        reduz a área em pelo menos 20% E preserva pelo menos 20% da área
        original em conteúdo não-preto (evita imagens quase totalmente
        escuras serem cropadas a quase nada)."""
        if bgr.ndim != 3 or bgr.shape[2] != 3:
            return bgr
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        mask = gray > 20  # tolerante a noise de compressão JPEG

        h, w = bgr.shape[:2]
        total = h * w
        if not mask.any() or mask.sum() < total * 0.20:
            return bgr  # imagem quase toda escura — não corta

        ys, xs = np.where(mask)
        y0, y1 = int(ys.min()), int(ys.max()) + 1
        x0, x1 = int(xs.min()), int(xs.max()) + 1
        # Pequeno padding pra não cortar bordas suaves do anti-aliasing
        pad = 2
        y0 = max(0, y0 - pad)
        x0 = max(0, x0 - pad)
        y1 = min(h, y1 + pad)
        x1 = min(w, x1 + pad)
        cropped = bgr[y0:y1, x0:x1]

        ch, cw = cropped.shape[:2]
        if (ch * cw) / total < 0.80:  # ganho de >= 20% — vale a pena
            return cropped
        return bgr  # crop pouco significativo, mantém original

    def _build_dims(self, w: int, h: int, square: bool) -> list[tuple[int, int]]:
        if square:
            return [
                (s, s) for s in SQUARE_SIZES
                if 12 <= s < min(self.height, self.width)
            ]
        dims = []
        for scale in ASPECT_SCALES:
            tw, th = int(w * scale), int(h * scale)
            if tw < 12 or th < 12:
                continue
            if tw >= self.width or th >= self.height:
                continue
            dims.append((tw, th))
        return dims

    def _scan(
        self,
        logo: np.ndarray,
        use_color: bool,
        dims: list[tuple[int, int]],
    ) -> Optional[dict]:
        haystack = self.mosaic_bgr if use_color else self.mosaic_gray
        best: Optional[dict] = None
        for tw, th in dims:
            template = cv2.resize(logo, (tw, th), interpolation=cv2.INTER_AREA)
            result = cv2.matchTemplate(haystack, template, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)
            if best is None or max_val > best["confidence"]:
                best = {
                    "confidence": float(max_val),
                    "x": max_loc[0],
                    "y": max_loc[1],
                    "w": tw,
                    "h": th,
                }
        return best

    def _second_peak(
        self,
        logo_bgr: np.ndarray,
        logo_gray: np.ndarray,
        best: dict,
    ) -> tuple[float, float]:
        method = best["method"]
        use_color = method.startswith("color")
        haystack = self.mosaic_bgr if use_color else self.mosaic_gray
        logo = logo_bgr if use_color else logo_gray
        template = cv2.resize(logo, (best["w"], best["h"]), interpolation=cv2.INTER_AREA)
        result = cv2.matchTemplate(haystack, template, cv2.TM_CCOEFF_NORMED)

        # Suprime região ao redor do melhor pico (NMS de raio = tamanho do
        # template) e mede o próximo max.
        r = max(best["w"], best["h"])
        y0 = max(0, best["y"] - r)
        y1 = min(result.shape[0], best["y"] + r)
        x0 = max(0, best["x"] - r)
        x1 = min(result.shape[1], best["x"] + r)
        result[y0:y1, x0:x1] = -1.0
        _, second_val, _, _ = cv2.minMaxLoc(result)
        margin = best["confidence"] - float(second_val)
        return margin, float(second_val)
