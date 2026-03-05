import os
# Must be set before importing sklearn / joblib / loky.
os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes.llm_routes import router as llm_router
from fastapi import APIRouter
from backend.services.llm_service import query_llm
from backend.api.routes import agent_routes
from backend.api.routes import rag_routes
from backend.api.routes import ml_routes

app = FastAPI(title="AI Analytics Platform")

# ── CORS ──────────────────────────────────────────────────────────────────────
# In dev: Nginx or Next.js rewrites handle routing (no CORS needed).
# In production: Frontend (Vercel) and Backend (HF Spaces) are different origins,
# so CORS must be enabled. ALLOWED_ORIGINS env var lets you restrict to your
# Vercel URL in production; defaults to "*" for dev/testing convenience.
_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
origins = [o.strip() for o in _origins_env.split(",")] if _origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

app.include_router(llm_router)
app.include_router(agent_routes.router)
app.include_router(rag_routes.router)
app.include_router(ml_routes.router)

@app.get("/")
def health_check():
    return {"status": "running"}

@app.get("/test-llm")
def test_llm():
    return query_llm("Explain AI Analytics in simple terms")