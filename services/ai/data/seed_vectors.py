"""
Seed ChromaDB with syllabus document chunks for RAG retrieval.
Splits syllabus markdown files by week/section headings and stores them.
"""

import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core.rag_pipeline import ingest_documents, get_collection

MOCK_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "mock-data")

COURSE_MAP = {
    "year5-maths.md": {
        "courseId": "course-1",
        "yearLevel": "Year 5",
        "subject": "Mathematics",
    },
    "year5-english.md": {
        "courseId": "course-2",
        "yearLevel": "Year 5",
        "subject": "English",
    },
    "year6-science.md": {
        "courseId": "course-3",
        "yearLevel": "Year 6",
        "subject": "Science",
    },
}


def split_by_weeks(content: str) -> list[dict]:
    """Split markdown content by ## headings (week sections)."""
    sections = re.split(r"(?=^## )", content, flags=re.MULTILINE)
    chunks = []

    for section in sections:
        section = section.strip()
        if not section or section.startswith("# "):
            # Skip the title header, but keep it as a metadata chunk
            if section.startswith("# "):
                chunks.append({
                    "text": section,
                    "topic": "Course Overview",
                    "weekNumber": 0,
                })
            continue

        # Extract week number and topic from heading
        heading_match = re.match(r"## Week (\d+)[-–](\d+):\s*(.+)", section)
        if heading_match:
            week_start = int(heading_match.group(1))
            topic = heading_match.group(3).strip()
        else:
            week_start = 0
            topic_match = re.match(r"## (.+)", section)
            topic = topic_match.group(1).strip() if topic_match else "General"

        chunks.append({
            "text": section,
            "topic": topic,
            "weekNumber": week_start,
        })

    return chunks


def seed():
    print("🌱 Seeding ChromaDB with syllabus documents...")

    syllabus_dir = os.path.join(MOCK_DATA_DIR, "syllabus")
    all_chunks = []

    for filename, meta in COURSE_MAP.items():
        filepath = os.path.join(syllabus_dir, filename)
        if not os.path.exists(filepath):
            print(f"  ⚠ File not found: {filepath}")
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        sections = split_by_weeks(content)
        print(f"  📄 {filename}: {len(sections)} chunks")

        for i, section in enumerate(sections):
            chunk_id = f"{meta['courseId']}-chunk-{i}"
            all_chunks.append({
                "id": chunk_id,
                "text": section["text"],
                "metadata": {
                    "courseId": meta["courseId"],
                    "yearLevel": meta["yearLevel"],
                    "subject": meta["subject"],
                    "weekNumber": section["weekNumber"],
                    "topic": section["topic"],
                },
            })

    if all_chunks:
        ingest_documents(all_chunks)
        print(f"\n✅ Ingested {len(all_chunks)} chunks into ChromaDB")
    else:
        print("\n⚠ No chunks to ingest")

    # Verify
    collection = get_collection()
    print(f"  Collection count: {collection.count()}")


if __name__ == "__main__":
    seed()
