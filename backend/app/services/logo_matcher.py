import cv2
import numpy as np
from pathlib import Path
from typing import Optional

# Alinhado ao código base do PRD: linspace fino, threshold 0.45.
# Estratégia two-resolution: busca num mosaico reduzido (DOWNSCALE) com
# 60 escalas + verificação refinada na resolução cheia ao redor da melhor
# posição. Mantém acurácia e cai de ~50s para ~3-5s no kvm4.
DOWNSCALE = 0.5
COARSE_SCALES = np.concatenate([
    np.linspace(0.15, 0.39, 13),
    np.linspace(0.40, 2.50, 40),
])
REFINE_NEIGHBORHOOD_RATIO = 1.5
REFINE_SCALES_AROUND = np.linspace(-0.06, 0.06, 7)
MIN_CONFIDENCE = 0.45


class LogoMatcher:
    def __init__(self, mosaic_path: Path):
        img = cv2.imread(str(mosaic_path), cv2.IMREAD_COLOR)
        if img is None:
            raise RuntimeError(f"Could not load mosaic at {mosaic_path}")
        self.mosaic = img
        self.mosaic_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        self.height, self.width = img.shape[:2]

        self.coarse_gray = cv2.resize(
            self.mosaic_gray,
            (int(self.width * DOWNSCALE), int(self.height * DOWNSCALE)),
            interpolation=cv2.INTER_AREA,
        )
        self.coarse_h, self.coarse_w = self.coarse_gray.shape[:2]

    def find(self, logo_bytes: bytes) -> dict:
        arr = np.frombuffer(logo_bytes, dtype=np.uint8)
        logo = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if logo is None:
            return {"found": False, "confidence": 0.0, "reason": "decode_failed"}

        logo_gray = cv2.cvtColor(logo, cv2.COLOR_BGR2GRAY)

        coarse = self._coarse_pass(logo_gray)
        if coarse is None:
            return {"found": False, "confidence": 0.0, "reason": "no_candidates"}

        best = self._refine_pass(logo_gray, coarse)

        if best["confidence"] < MIN_CONFIDENCE:
            return {
                "found": False,
                "confidence": round(best["confidence"], 4),
                "reason": "low_confidence",
            }

        return {
            "found": True,
            "confidence": round(best["confidence"], 4),
            "position": {
                "x": int(best["x"]),
                "y": int(best["y"]),
                "width": int(best["w"]),
                "height": int(best["h"]),
                "centerX": int(best["x"] + best["w"] / 2),
                "centerY": int(best["y"] + best["h"] / 2),
            },
            "mosaic": {"width": self.width, "height": self.height},
        }

    def _coarse_pass(self, logo_gray: np.ndarray) -> Optional[dict]:
        h, w = logo_gray.shape[:2]
        best: Optional[dict] = None

        for scale in COARSE_SCALES:
            effective_scale = scale * DOWNSCALE
            tw = int(w * effective_scale)
            th = int(h * effective_scale)
            if tw < 8 or th < 8:
                continue
            if tw >= self.coarse_w or th >= self.coarse_h:
                continue

            template = cv2.resize(logo_gray, (tw, th), interpolation=cv2.INTER_AREA)
            result = cv2.matchTemplate(self.coarse_gray, template, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)

            if best is None or max_val > best["confidence"]:
                best = {
                    "confidence": float(max_val),
                    "x_coarse": max_loc[0],
                    "y_coarse": max_loc[1],
                    "scale": float(scale),
                    "tw_coarse": tw,
                    "th_coarse": th,
                }

        return best

    def _refine_pass(self, logo_gray: np.ndarray, coarse: dict) -> dict:
        h, w = logo_gray.shape[:2]
        base_scale = coarse["scale"]

        cx_full = int(coarse["x_coarse"] / DOWNSCALE)
        cy_full = int(coarse["y_coarse"] / DOWNSCALE)
        size_full = int(coarse["tw_coarse"] / DOWNSCALE)
        radius = int(size_full * REFINE_NEIGHBORHOOD_RATIO)

        x0 = max(0, cx_full - radius)
        y0 = max(0, cy_full - radius)
        x1 = min(self.width, cx_full + size_full + radius)
        y1 = min(self.height, cy_full + size_full + radius)
        roi = self.mosaic_gray[y0:y1, x0:x1]
        roi_h, roi_w = roi.shape[:2]

        best = {"confidence": -1.0, "x": cx_full, "y": cy_full, "w": size_full, "h": size_full}

        for delta in REFINE_SCALES_AROUND:
            scale = base_scale + delta
            if scale <= 0:
                continue
            tw, th = int(w * scale), int(h * scale)
            if tw < 8 or th < 8 or tw >= roi_w or th >= roi_h:
                continue

            template = cv2.resize(logo_gray, (tw, th), interpolation=cv2.INTER_AREA)
            result = cv2.matchTemplate(roi, template, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)

            if max_val > best["confidence"]:
                best = {
                    "confidence": float(max_val),
                    "x": x0 + max_loc[0],
                    "y": y0 + max_loc[1],
                    "w": tw,
                    "h": th,
                }

        return best
