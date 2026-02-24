from fastapi import APIRouter
from pydantic import BaseModel
import subprocess
import os
import pandas as pd
import zipfile

router = APIRouter(prefix="/kaggle", tags=["Kaggle"])

DATA_PATH = "backend/storage/temp_dataset.pkl"


class KaggleRequest(BaseModel):
    dataset: str  # Example: "zynicide/wine-reviews"


@router.post("/download")
def download_kaggle_dataset(request: KaggleRequest):

    os.makedirs("backend/storage", exist_ok=True)

    # Download dataset
    subprocess.run(
        ["kaggle", "datasets", "download", "-d", request.dataset, "-p", "backend/storage", "--unzip"],
        check=True
    )

    # Find first CSV file
    files = os.listdir("backend/storage")
    csv_files = [f for f in files if f.endswith(".csv")]

    if not csv_files:
        return {"error": "No CSV file found in dataset."}

    csv_path = os.path.join("backend/storage", csv_files[0])
    df = pd.read_csv(csv_path)

    df.to_pickle(DATA_PATH)

    return {
        "message": "Dataset downloaded successfully",
        "columns": list(df.columns),
        "rows": len(df)
    }