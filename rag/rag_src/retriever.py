import os
import pickle
import pandas as pd
from rag.rag_src.vector_store import VectorStore
from rag.rag_src.doc_loader import DocumentLoader
from rag.rag_src.chunker import TextChunker

DATA_PATH = "backend/storage/temp_dataset.pkl"


def _build_dataset_chunks(df: pd.DataFrame) -> list:
    """Generate plain-text context chunks from an uploaded DataFrame."""
    chunks = []

    # Overview
    chunks.append(
        f"Dataset overview: {df.shape[0]} rows, {df.shape[1]} columns. "
        f"Columns: {', '.join(df.columns.tolist())}."
    )

    # Dtypes
    dtype_str = ", ".join([f"{col} ({dtype})" for col, dtype in df.dtypes.items()])
    chunks.append(f"Column types: {dtype_str}.")

    # Numeric stats
    numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns.tolist()
    if numeric_cols:
        for col in numeric_cols:
            s = df[col].dropna()
            chunks.append(
                f"Column '{col}' (numeric): min={s.min():.3g}, max={s.max():.3g}, "
                f"mean={s.mean():.3g}, std={s.std():.3g}, missing={df[col].isna().sum()}."
            )

    # Categorical sample values
    cat_cols = df.select_dtypes(include=["object"]).columns.tolist()
    for col in cat_cols:
        top = df[col].value_counts().head(5).index.tolist()
        chunks.append(
            f"Column '{col}' (categorical): top values are {top}. "
            f"Unique values: {df[col].nunique()}, missing: {df[col].isna().sum()}."
        )

    # Sample rows (limited to 3 to save tokens)
    sample_csv = df.head(min(3, len(df))).to_csv(index=False)
    chunks.append(f"Sample data rows from the dataset:\n{sample_csv}")

    return chunks


class Retriever:

    def __init__(self):
        self.vector_store = VectorStore()
        self.loader = DocumentLoader()
        self.chunker = TextChunker()
        self._load_data()

    def _load_data(self):
        # Static knowledge base
        text = self.loader.load_text("rag/data/knowledge_base.txt")
        chunks = self.chunker.chunk(text)

        # Dataset-aware context (if a dataset has been uploaded)
        if os.path.exists(DATA_PATH):
            try:
                with open(DATA_PATH, "rb") as f:
                    df = pickle.load(f)
                chunks += _build_dataset_chunks(df)
            except Exception as e:
                print(f"RAG: could not load dataset context: {e}")

        self.vector_store.build_index(chunks)

    def _get_dataset_context(self):
        context_str = ""
        if os.path.exists(DATA_PATH):
            try:
                with open(DATA_PATH, "rb") as f:
                    df = pickle.load(f)
                context_str += "\n\n".join(_build_dataset_chunks(df))
            except Exception:
                pass
        
        REPORT_PATH = "backend/storage/temp_report.json"
        if os.path.exists(REPORT_PATH):
            try:
                import json
                with open(REPORT_PATH, "r") as f:
                    report = json.load(f)
                
                # Truncate lists to prevent large token counts
                if "feature_names" in report:
                    report["feature_names"] = report["feature_names"][:10] + ["...truncated..."]
                if "feature_importance" in report:
                    report["feature_importance"] = report["feature_importance"][:10]

                context_str += "\n\n--- MODEL TRAINING REPORT ---\n"
                context_str += json.dumps(report, indent=2)
            except Exception:
                pass
                
        return context_str

    def retrieve(self, query):
        chunks = self.vector_store.search(query)
        # Always inject dynamic dataset context so answers are specific to the dataset
        ds_context = self._get_dataset_context()
        if ds_context:
            chunks.append(f"--- CURRENT DATASET & MODEL CONTEXT ---\n{ds_context}")
        return chunks
