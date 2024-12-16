from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
from app.services.storage import get_doc
from app.services.translation import enqueue_translation_job, TranslationChapterInput
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class TranslateRequest(BaseModel):
    session_id: str = Field(..., description="ID of the document session")
    target_language: str = Field(..., description="Target language code, e.g. 'fr', 'de'")

@router.post("/translate")
async def translate_document(req: TranslateRequest):
    """
    Initiates a translation job for the given session's chapters into the target language.
    Returns a job_id to track status.
    """
    chapters = get_doc(req.session_id)
    if not chapters:
        raise HTTPException(status_code=404, detail="Document not found")

    chapters_input = [
        TranslationChapterInput(
            id=ch["id"],
            markdown=ch["markdown"]
        ) for ch in chapters
    ]

    job_id = await enqueue_translation_job(chapters_input, req.target_language)
    logger.info(f"Translation job {job_id} queued for session {req.session_id}")
    return {"job_id": job_id}
