import time
from typing import Dict, List, Optional

# In-memory storage (not thread-safe)
DOCS: Dict = {}
JOBS: Dict = {}

def store_doc(session_id: str, chapters: List[dict]):
    DOCS[session_id] = {
        "chapters": chapters,
        "created_at": time.time()
    }

def get_doc(session_id: str) -> Optional[List[dict]]:
    doc = DOCS.get(session_id)
    return doc["chapters"] if doc else None

def store_translation_job(job: dict):
    JOBS[job["id"]] = job

def get_translation_job(job_id: str) -> Optional[dict]:
    return JOBS.get(job_id)

def update_translation_job(job: dict):
    JOBS[job["id"]] = job
