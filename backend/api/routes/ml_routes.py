from fastapi import APIRouter, UploadFile, File
import pandas as pd
import os

from backend.services.ml_service import run_training

router = APIRouter(prefix="/ml", tags=["ML"])

DATA_PATH = "backend/storage/temp_dataset.pkl"


@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    os.makedirs("backend/storage", exist_ok=True)
    df.to_pickle(DATA_PATH)

    return {
        "message": "Dataset uploaded successfully",
        "columns": list(df.columns),
        "rows": len(df)
    }


@router.post("/train")
async def train_model(target_column: str):

    if not os.path.exists(DATA_PATH):
        return {"error": "No dataset uploaded."}

    df = pd.read_pickle(DATA_PATH)

    report = run_training(df, target_column)

    return report