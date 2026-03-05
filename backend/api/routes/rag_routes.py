from fastapi import APIRouter
from pydantic import BaseModel
from rag.rag_src.rag_service import RAGService

router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)

class QueryRequest(BaseModel):
    query: str

@router.post("/query")
def query_endpoint(request: QueryRequest):
    response = RAGService().query(request.query)
    return {"answer": response}
