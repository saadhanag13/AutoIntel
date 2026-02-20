from fastapi import APIRouter
from agents.agent_manager import AgentManager

router = APIRouter(prefix="/agent", tags=["Agents"])

manager = AgentManager()


@router.get("/run")
async def run_agent(prompt: str):
    result = manager.route(prompt)
    return {"result": result}
