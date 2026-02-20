import faiss
import numpy as np
from rag.rag_src.embeddings import EmbeddingModel


class VectorStore:

    def __init__(self):
        self.embedding_model = EmbeddingModel()
        self.index = None
        self.documents = []

    def build_index(self, docs):

        self.documents = docs
        embeddings = self.embedding_model.encode(docs)

        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(np.array(embeddings).astype("float32"))

    def search(self, query, k=3):

        query_vector = self.embedding_model.encode([query])
        distances, indices = self.index.search(query_vector.astype("float32"), k)

        return [self.documents[i] for i in indices[0]]
