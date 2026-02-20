from fastapi import APIRouter, HTTPException
from backend.services.llm_service import LLMService

router = APIRouter(prefix="/llm", tags=["LLM"])

# Simple one-shot prompt
@router.get("/generate")
async def generate(prompt: str):
    try:
        result = LLMService.generate_response("default", prompt)

        if not result:
            raise HTTPException(status_code=500, detail="Empty response from LLM")

        return {"response": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Chat with memory
@router.get("/chat")
async def chat(session_id: str, prompt: str):

    response = LLMService.generate_response(session_id, prompt)

    return {
        "session_id": session_id,
        "response": response
    }
