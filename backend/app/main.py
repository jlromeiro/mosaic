import os
import time
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

from app.services.logo_matcher import LogoMatcher
from app.services.stats import Stats
from app.services.share_image import generate_share_image, generate_zoom_image
from app.utils.image_io import validate_upload

BASE_DIR = Path(__file__).resolve().parent.parent
MOSAIC_PATH = Path(os.getenv("MOSAIC_PATH", BASE_DIR / "assets" / "mosaic_original.jpg"))
STATS_PATH = Path(os.getenv("STATS_PATH", BASE_DIR / "data" / "stats.json"))

app = FastAPI(title="Mosaico Solana Hackathon API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

matcher: LogoMatcher | None = None
stats: Stats | None = None


@app.on_event("startup")
def _startup() -> None:
    global matcher, stats
    if not MOSAIC_PATH.exists():
        raise RuntimeError(f"Mosaic image not found at {MOSAIC_PATH}")
    matcher = LogoMatcher(MOSAIC_PATH)
    stats = Stats(STATS_PATH)


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "mosaic": {"width": matcher.width, "height": matcher.height} if matcher else None,
    }


@app.get("/api/stats")
def get_stats() -> dict:
    return stats.get() if stats else {"searches_total": 0, "logos_found": 0, "success_rate": 0.0}


@app.post("/api/find-logo")
async def find_logo(file: UploadFile = File(...)) -> dict:
    contents = await file.read()
    ok, reason = validate_upload(file.content_type or "", len(contents))
    if not ok:
        raise HTTPException(status_code=400, detail=reason)

    started = time.perf_counter()
    result = matcher.find(contents)
    elapsed_ms = int((time.perf_counter() - started) * 1000)

    found = result.get("found", False)
    snapshot = stats.increment(found)

    response = {
        "success": True,
        "elapsed_ms": elapsed_ms,
        "stats": snapshot,
        **result,
    }
    response["message"] = (
        "Logo found"
        if found
        else "We could not find a reliable match. Try uploading a clearer crop."
    )
    return response


class ShareImageRequest(BaseModel):
    x: int = Field(..., ge=0)
    y: int = Field(..., ge=0)
    width: int = Field(..., gt=0)
    height: int = Field(..., gt=0)


@app.post("/api/generate-share-image")
def share_image(req: ShareImageRequest) -> Response:
    if req.x + req.width > matcher.width or req.y + req.height > matcher.height:
        raise HTTPException(status_code=400, detail="position_out_of_bounds")
    png_bytes = generate_share_image(MOSAIC_PATH, req.x, req.y, req.width, req.height)
    return Response(content=png_bytes, media_type="image/png")


class ZoomImageRequest(BaseModel):
    center_x: int = Field(..., ge=0)
    center_y: int = Field(..., ge=0)
    crop_half: int = Field(220, ge=20, le=1000)


@app.post("/api/generate-zoom-image")
def zoom_image(req: ZoomImageRequest) -> Response:
    png_bytes = generate_zoom_image(
        MOSAIC_PATH, req.center_x, req.center_y, req.crop_half
    )
    return Response(content=png_bytes, media_type="image/png")
