import os
# Must be set before importing sklearn / joblib / loky.
# On Windows, loky spawns worker processes via 'spawn' which is incompatible
# with uvicorn's ASGI process. Capping to 1 forces sequential in-process execution.
os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

from fastapi import FastAPI
from backend.api.routes.llm_routes import router as llm_router
from fastapi import APIRouter
from backend.services.llm_service import query_llm
from backend.api.routes import agent_routes
from backend.api.routes import rag_routes
from backend.api.routes import ml_routes

app = FastAPI(title="AI Analytics Platform")
router = APIRouter()

# CORS is handled by Nginx.

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