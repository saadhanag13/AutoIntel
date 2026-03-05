from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import pandas as pd
import traceback
import threading
import json
import time
import os

from backend.services.ml_service import run_training

router = APIRouter(prefix="/ml", tags=["ML"])

DATA_PATH   = "backend/storage/temp_dataset.pkl"
REPORT_PATH = "backend/storage/temp_report.json"
PROGRESS_PATH = "backend/storage/training_progress.json"


def _write_progress(messages: list[str], done: bool = False, error: str | None = None):
    """Write current training progress to a temp file for polling."""
    os.makedirs("backend/storage", exist_ok=True)
    with open(PROGRESS_PATH, "w") as f:
        json.dump({"messages": messages, "done": done, "error": error}, f)


def _clear_progress():
    try:
        if os.path.exists(PROGRESS_PATH):
            os.remove(PROGRESS_PATH)
    except Exception:
        pass


# ── Upload ───────────────────────────────────────────────────────────────────
@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    os.makedirs("backend/storage", exist_ok=True)
    df.to_pickle(DATA_PATH)

    # Clear any previous training progress when a new dataset is uploaded
    _clear_progress()

    return {
        "message": "Dataset uploaded successfully",
        "columns": list(df.columns),
        "rows": len(df),
    }


# ── Progress poll ────────────────────────────────────────────────────────────
@router.get("/progress")
async def get_progress():
    """Lightweight poll endpoint — returns current training progress messages."""
    if not os.path.exists(PROGRESS_PATH):
        return {"messages": [], "done": False, "error": None}
    try:
        with open(PROGRESS_PATH) as f:
            return json.load(f)
    except Exception:
        return {"messages": [], "done": False, "error": None}


# ── Train ─────────────────────────────────────────────────────────────────────
# Using a SYNC def (not async def) so FastAPI automatically runs it
# in a thread pool. This prevents blocking the ASGI event loop.
@router.post("/train")
def train_model(target_column: str):
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=400, detail="No dataset uploaded.")

    df = pd.read_pickle(DATA_PATH)

    _write_progress(["🔍 Detecting problem type…"])

    try:
        report = run_training(df, target_column, progress_cb=_write_progress)
    except Exception as e:
        traceback.print_exc()
        _write_progress([], done=True, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

    # Persist report for RAG context
    try:
        os.makedirs("backend/storage", exist_ok=True)
        with open(REPORT_PATH, "w") as f:
            json.dump(report, f)
    except Exception as e:
        print(f"Warning: could not save report: {e}")

    _write_progress(
        [f"✅ Training complete — best model: {report.get('best_model', '?')}"],
        done=True,
    )
    return report