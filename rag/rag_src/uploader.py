from fastapi import UploadFile
from rag.rag_src.chunker import TextChunker
from rag.rag_src.vector_store import VectorStore
from rag.rag_src.embeddings import EmbeddingModel


class DocumentUploader:

    def __init__(self):
        self.chunker = TextChunker()
        self.vector_store = VectorStore()
        self.embedder = EmbeddingModel()

    async def process_file(self, file: UploadFile):

        content = await file.read()
        text = content.decode("utf-8")

        chunks = self.chunker.chunk_text(text)

        embeddings = self.embedder.embed_documents(chunks)

        self.vector_store.add_documents(chunks, embeddings)

        return {"status": "Document indexed", "chunks": len(chunks)}
