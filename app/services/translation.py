import uuid
from typing import List, Dict
from pydantic import BaseModel
from app.services.storage import store_translation_job, get_translation_job, update_translation_job
from app.services.background import add_translation_task
from app.services.validation import sanitize_language_code
import logging

logger = logging.getLogger(__name__)

class TranslationChapterInput(BaseModel):
    id: str
    markdown: str
    level: int = 1  # Added level field with default value

async def enqueue_translation_job(chapters: List[TranslationChapterInput], target_language: str) -> str:
    """
    Create a translation job and enqueue it for asynchronous processing.
    """
    target_language = sanitize_language_code(target_language)
    job_id = str(uuid.uuid4())
    
    # Initialize job with proper structure
    job = {
        "id": job_id,
        "status": "queued",
        "target_language": target_language,
        "chapters": [{"id": ch.id, "markdown": ch.markdown} for ch in chapters],
        "translated_chapters": [],
        "completed": 0,
        "total": len(chapters),
        "error": None
    }
    
    # Store the job before queuing
    store_translation_job(job)

    # Enqueue for background processing
    add_translation_task(job_id)
    logger.info(f"Translation job {job_id} created and enqueued.")
    return job_id