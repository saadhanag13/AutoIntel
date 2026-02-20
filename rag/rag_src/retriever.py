from rag.rag_src.vector_store import VectorStore
from rag.rag_src.doc_loader import DocumentLoader
from rag.rag_src.chunker import TextChunker


class Retriever:

    def __init__(self):
        self.vector_store = VectorStore()
        self.loader = DocumentLoader()
        self.chunker = TextChunker()
        self._load_data()

    def _load_data(self):

        text = self.loader.load_text("rag/data/knowledge_base.txt")

        chunks = self.chunker.chunk(text)

        self.vector_store.build_index(chunks)

    def retrieve(self, query):
        return self.vector_store.search(query)
