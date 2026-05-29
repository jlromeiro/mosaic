"""Testes de validação/leitura de upload (image_io)."""

import asyncio
from io import BytesIO

import pytest

from app.utils.image_io import MAX_BYTES, read_upload_capped, validate_upload


class _FakeUpload:
    def __init__(self, data: bytes, content_type: str = "image/png"):
        self.content_type = content_type
        self._buf = BytesIO(data)

    async def read(self, n: int = -1) -> bytes:
        return self._buf.read(n)


def test_validate_upload_type_and_size():
    assert validate_upload("image/png", 100) == (True, "")
    ok, reason = validate_upload("application/pdf", 100)
    assert not ok and reason.startswith("unsupported_type")
    ok, reason = validate_upload("image/png", MAX_BYTES + 1)
    assert not ok and reason.startswith("too_large")


def test_read_capped_ok():
    data = b"\x89PNG fake content"
    assert asyncio.run(read_upload_capped(_FakeUpload(data))) == data


def test_read_capped_rejects_bad_type():
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as ei:
        asyncio.run(read_upload_capped(_FakeUpload(b"x", content_type="application/pdf")))
    assert ei.value.status_code == 400


def test_read_capped_rejects_oversize():
    from fastapi import HTTPException
    big = b"x" * (MAX_BYTES + 1024)
    with pytest.raises(HTTPException) as ei:
        asyncio.run(read_upload_capped(_FakeUpload(big)))
    assert ei.value.status_code == 413


def test_read_capped_rejects_empty():
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as ei:
        asyncio.run(read_upload_capped(_FakeUpload(b"")))
    assert ei.value.status_code == 400
