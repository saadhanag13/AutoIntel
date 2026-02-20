from fastapi import APIRouter
from rag.rag_src.rag_service import RAGService

router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)

@router.get("/query")
def query_endpoint(question: str):
    response = RAGService().query(question)
    return {"answer": response}
