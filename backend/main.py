from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes.llm_routes import router as llm_router
from fastapi import APIRouter
from backend.services.llm_service import query_llm
from backend.api.routes import agent_routes
from backend.api.routes import rag_routes

app = FastAPI(title="AI Analytics Platform")
router= APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(llm_router)
app.include_router(agent_routes.router)
app.include_router(rag_routes.router)

@app.get("/")
def health_check():
    return {"status": "running"}

@app.get("/test-llm")
def test_llm():
    return query_llm("Explain AI Analytics in simple terms")