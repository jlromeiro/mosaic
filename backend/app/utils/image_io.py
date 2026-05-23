ALLOWED_MIME = {"image/png", "image/jpeg", "image/jpg", "image/webp"}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB


def validate_upload(content_type: str, size: int) -> tuple[bool, str]:
    if content_type not in ALLOWED_MIME:
        return False, f"unsupported_type:{content_type}"
    if size > MAX_BYTES:
        return False, f"too_large:{size}"
    return True, ""
