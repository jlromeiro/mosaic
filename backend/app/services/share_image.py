from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw


def generate_share_image(
    mosaic_path: Path,
    x: int,
    y: int,
    width: int,
    height: int,
) -> bytes:
    image = Image.open(mosaic_path).convert("RGB")
    draw = ImageDraw.Draw(image)

    margin = 12
    draw.rectangle(
        [x - margin, y - margin, x + width + margin, y + height + margin],
        outline=(20, 241, 149),
        width=6,
    )

    cx = x + width // 2
    cy = y + height // 2
    radius = max(width, height) + 25
    draw.ellipse(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        outline=(153, 69, 255),
        width=6,
    )

    buf = BytesIO()
    image.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def generate_zoom_image(
    mosaic_path: Path,
    center_x: int,
    center_y: int,
    crop_half: int = 220,
    upscale: int = 3,
) -> bytes:
    image = Image.open(mosaic_path).convert("RGB")
    left = max(center_x - crop_half, 0)
    top = max(center_y - crop_half, 0)
    right = min(center_x + crop_half, image.width)
    bottom = min(center_y + crop_half, image.height)
    zoom = image.crop((left, top, right, bottom))
    zoom = zoom.resize(
        (zoom.width * upscale, zoom.height * upscale),
        Image.Resampling.LANCZOS,
    )
    buf = BytesIO()
    zoom.save(buf, format="PNG", optimize=True)
    return buf.getvalue()
