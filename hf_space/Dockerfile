# ─────────────────────────────────────────────────────────────────────────────
#  AutoIntel — FastAPI Backend for Hugging Face Spaces
#  HF Spaces exposes port 7860 by default.
# ─────────────────────────────────────────────────────────────────────────────

FROM python:3.11-slim

# ── OS deps ───────────────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    git \
    && rm -rf /var/lib/apt/lists/*

# ── Working directory ─────────────────────────────────────────────────────────
WORKDIR /app

# ── Python deps ───────────────────────────────────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Application source ────────────────────────────────────────────────────────
COPY backend/        ./backend/
COPY ml_engine/      ./ml_engine/
COPY data_processing/ ./data_processing/
COPY rag/            ./rag/
COPY agents/         ./agents/
COPY insights/       ./insights/
COPY tools/          ./tools/
COPY configs/        ./configs/

# ── Runtime directories ───────────────────────────────────────────────────────
RUN mkdir -p backend/storage saved_models chroma_data

# ── Environment variables ─────────────────────────────────────────────────────
ENV LOKY_MAX_CPU_COUNT=1 \
    OMP_NUM_THREADS=1 \
    MKL_NUM_THREADS=1 \
    PYTHONUNBUFFERED=1

# ── HF Spaces listens on 7860 ─────────────────────────────────────────────────
EXPOSE 7860
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
