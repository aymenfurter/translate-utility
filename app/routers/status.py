from fastapi import APIRouter, HTTPException
from app.services.storage import get_translation_job
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    """
    Get the status and progress of a given translation job.
    """
    job = get_translation_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
