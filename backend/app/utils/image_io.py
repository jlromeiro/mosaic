from fastapi import HTTPException, UploadFile

ALLOWED_MIME = {"image/png", "image/jpeg", "image/jpg", "image/webp"}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB
_CHUNK = 512 * 1024


def validate_upload(content_type: str, size: int) -> tuple[bool, str]:
    if content_type not in ALLOWED_MIME:
        return False, f"unsupported_type:{content_type}"
    if size > MAX_BYTES:
        return False, f"too_large:{size}"
    return True, ""


async def read_upload_capped(file: UploadFile) -> bytes:
    """Valida content-type e lê o upload em chunks, abortando com 413 ao
    exceder MAX_BYTES — não bufferiza arquivos gigantes inteiros antes de checar."""
    if (file.content_type or "") not in ALLOWED_MIME:
        raise HTTPException(status_code=400, detail=f"unsupported_type:{file.content_type}")
    chunks = []
    total = 0
    while True:
        chunk = await file.read(_CHUNK)
        if not chunk:
            break
        total += len(chunk)
        if total > MAX_BYTES:
            raise HTTPException(status_code=413, detail=f"too_large:>{MAX_BYTES}")
        chunks.append(chunk)
    if total == 0:
        raise HTTPException(status_code=400, detail="empty_file")
    return b"".join(chunks)
