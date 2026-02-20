from rag.rag_src.retriever import Retriever
from backend.services.llm_service import LLMService


class RAGService:

    def __init__(self):
        self.retriever = Retriever()
        self.llm = LLMService()

    def query(self, question):

        context = self.retriever.retrieve(question)

        prompt = f"""
        Answer the question using ONLY the context below.

        Context:
        {context}

        Question:
        {question}
        """

        return self.llm.generate_response("rag-session", prompt)
