import cv2
import numpy as np
from pathlib import Path
from typing import Optional

# Inspirado em ernanibmurtinho/colosseum-find-my-logo: matching em COR
# (BGR, 3 canais) ao invés de grayscale — as cores distintivas da logo
# (ex: cadeado branco + circuito azul do RPC) desambiguam de logos com
# formato similar que grayscale confunde.
#
# Template forçado a quadrado: células do mosaico do hackathon são
# quadradas, então a maioria das logos são exibidas em proporção 1:1.
#
# Range em pixels absolutos (não fração) cobrindo o tamanho típico de
# célula do mosaico Solana Hackathon (~30-60px de lado).
SIZES = list(range(26, 72, 2))  # 23 templates de 26x26 a 70x70
MIN_CONFIDENCE = 0.45


class LogoMatcher:
    def __init__(self, mosaic_path: Path):
        img = cv2.imread(str(mosaic_path), cv2.IMREAD_COLOR)
        if img is None:
            raise RuntimeError(f"Could not load mosaic at {mosaic_path}")
        self.mosaic = img  # BGR 3-channel
        self.height, self.width = img.shape[:2]

    def find(self, logo_bytes: bytes) -> dict:
        arr = np.frombuffer(logo_bytes, dtype=np.uint8)
        logo = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if logo is None:
            return {"found": False, "confidence": 0.0, "reason": "decode_failed"}

        best = self._best_match(logo)
        if best is None:
            return {"found": False, "confidence": 0.0, "reason": "no_candidates"}

        position = {
            "x": int(best["x"]),
            "y": int(best["y"]),
            "width": int(best["size"]),
            "height": int(best["size"]),
            "centerX": int(best["x"] + best["size"] / 2),
            "centerY": int(best["y"] + best["size"] / 2),
        }

        return {
            "found": best["confidence"] >= MIN_CONFIDENCE,
            "confidence": round(best["confidence"], 4),
            "position": position,
            "mosaic": {"width": self.width, "height": self.height},
        }

    def _best_match(self, logo_bgr: np.ndarray) -> Optional[dict]:
        best: Optional[dict] = None
        max_dim = min(self.width, self.height)

        for size in SIZES:
            if size >= max_dim:
                break

            # Template quadrado size x size, BGR.
            template = cv2.resize(logo_bgr, (size, size), interpolation=cv2.INTER_AREA)
            result = cv2.matchTemplate(self.mosaic, template, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)

            if best is None or max_val > best["confidence"]:
                best = {
                    "confidence": float(max_val),
                    "x": max_loc[0],
                    "y": max_loc[1],
                    "size": size,
                }

        return best
