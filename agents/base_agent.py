from backend.core.logger import logger
from backend.services.llm_service import LLMService


class BaseAgent:

    def __init__(self, name: str):
        self.name = name

    def run_llm(self, session_id: str, prompt: str, context: str = ""):
        logger.info(f"{self.name} calling LLM")

        return LLMService.generate_response(session_id, prompt, context)
