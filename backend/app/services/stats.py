import json
import os
import tempfile
import threading
from pathlib import Path

_LOCK = threading.Lock()


class Stats:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self._write({"searches_total": 0, "logos_found": 0})

    def get(self) -> dict:
        with _LOCK:
            data = self._read()
        total = data["searches_total"]
        found = data["logos_found"]
        return {
            "searches_total": total,
            "logos_found": found,
            "success_rate": round(found / total, 3) if total > 0 else 0.0,
        }

    def increment(self, found: bool) -> dict:
        with _LOCK:
            data = self._read()
            data["searches_total"] += 1
            if found:
                data["logos_found"] += 1
            self._write(data)
        return self.get()

    def _read(self) -> dict:
        try:
            with self.path.open("r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"searches_total": 0, "logos_found": 0}

    def _write(self, data: dict) -> None:
        tmp_fd, tmp_path = tempfile.mkstemp(
            dir=str(self.path.parent), prefix=".stats-", suffix=".json"
        )
        try:
            with os.fdopen(tmp_fd, "w", encoding="utf-8") as f:
                json.dump(data, f)
            os.replace(tmp_path, self.path)
        except Exception:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            raise
