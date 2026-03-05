from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import traceback
import json
import os

from backend.services.ml_service import run_training

router = APIRouter(prefix="/ml", tags=["ML"])

DATA_PATH   = "backend/storage/temp_dataset.pkl"
REPORT_PATH = "backend/storage/temp_report.json"


@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    os.makedirs("backend/storage", exist_ok=True)
    df.to_pickle(DATA_PATH)

    return {
        "message": "Dataset uploaded successfully",
        "columns": list(df.columns),
        "rows": len(df),
    }


# Using a SYNC def (not async def) so FastAPI automatically runs it
# in a thread pool. This prevents blocking the ASGI event loop and
# avoids the pickling issues that asyncio.run_in_executor can cause
# when joblib/sklearn are involved on Windows.
@router.post("/train")
def train_model(target_column: str):
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=400, detail="No dataset uploaded.")

    df = pd.read_pickle(DATA_PATH)

    try:
        report = run_training(df, target_column)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    # Persist report for RAG context
    try:
        os.makedirs("backend/storage", exist_ok=True)
        with open(REPORT_PATH, "w") as f:
            json.dump(report, f)
    except Exception as e:
        print(f"Warning: could not save report: {e}")

    return report