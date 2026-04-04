"""
RAG Pipeline: document ingestion and retrieval via ChromaDB.
"""

import os
import chromadb

_chroma_client: chromadb.ClientAPI | None = None
COLLECTION_NAME = "edux_syllabus"


def get_chroma_client() -> chromadb.ClientAPI:
    global _chroma_client
    if _chroma_client is None:
        persist_dir = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
        _chroma_client = chromadb.PersistentClient(path=persist_dir)
    return _chroma_client


def get_collection():
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def ingest_documents(chunks: list[dict]):
    """
    Ingest document chunks into ChromaDB.

    Each chunk should have:
    - id: unique identifier
    - text: content text
    - metadata: dict with courseId, yearLevel, subject, weekNumber, topic
    """
    collection = get_collection()
    collection.upsert(
        ids=[c["id"] for c in chunks],
        documents=[c["text"] for c in chunks],
        metadatas=[c["metadata"] for c in chunks],
    )


def query_documents(query: str, course_id: str | None = None, top_k: int = 5) -> list[str]:
    """
    Query ChromaDB for relevant document chunks.
    Returns list of document text strings.
    """
    collection = get_collection()

    where_filter = None
    if course_id:
        where_filter = {"courseId": course_id}

    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where=where_filter,
    )

    if results and results["documents"]:
        return results["documents"][0]
    return []
