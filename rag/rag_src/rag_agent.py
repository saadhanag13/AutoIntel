from agents.base_agent import BaseAgent
from rag.rag_src.rag_service import RAGService


class RAGAgent(BaseAgent):

    def __init__(self):
        super().__init__("RAGAgent")
        self.rag = RAGService()

    def run(self, task: str):
        return self.rag.query(task)
