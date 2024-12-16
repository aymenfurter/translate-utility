import asyncio
import logging
from typing import Optional
from app.services.llm_integration import translate_text_with_context
from app.services.storage import get_translation_job, update_translation_job
from app.core.config import settings

logger = logging.getLogger(__name__)

# A global asyncio Queue for translation tasks (job_ids)
translation_queue: Optional[asyncio.Queue] = None
# Track the background worker tasks
worker_tasks = []

async def translation_worker(worker_id: int):
    """
    A worker that continuously processes translation jobs from the queue.
    """
    global translation_queue
    logger.info(f"Translation worker {worker_id} started.")
    while True:
        job_id = await translation_queue.get()
        if job_id is None:
            # Signal to shut down
            logger.info(f"Translation worker {worker_id} shutting down.")
            break
        await process_translation_job(job_id)
        translation_queue.task_done()

async def process_translation_job(job_id: str):
    """
    Process the given translation job by sequentially translating each chapter.
    """
    job = get_translation_job(job_id)
    if not job:
        logger.warning(f"Job {job_id} not found in storage.")
        return

    if job["status"] in ("completed", "failed"):
        logger.info(f"Job {job_id} is already in terminal state ({job['status']}).")
        return

    try:
        job["status"] = "in_progress"
        update_translation_job(job)
        
        for i, chap in enumerate(job["chapters"]):
            try:
                context_before = job["chapters"][i-1]['markdown'] if i > 0 else ""
                context_after = job["chapters"][i+1]['markdown'] if i < len(job["chapters"])-1 else ""
                
                translated = translate_text_with_context(
                    chap['markdown'],
                    context_before,
                    context_after,
                    job["target_language"]
                )
                
                job["translated_chapters"].append({
                    "id": chap["id"],
                    "translated_markdown": translated
                })
                job["completed"] = i + 1
                update_translation_job(job)
                
            except Exception as e:
                logger.exception(f"Translation failed for chapter {chap['id']} in job {job_id}")
                job["error"] = str(e)
                job["status"] = "failed"
                update_translation_job(job)
                return
        
        job["status"] = "completed"
        update_translation_job(job)
        logger.info(f"Job {job_id} completed successfully.")
        
    except Exception as e:
        logger.exception(f"Job {job_id} failed with unexpected error")
        job["status"] = "failed"
        job["error"] = str(e)
        update_translation_job(job)

def add_translation_task(job_id: str):
    """
    Add a translation job_id to the queue to be processed by a worker.
    If workers are not started, start them now.
    """
    global translation_queue, worker_tasks
    if translation_queue is None:
        translation_queue = asyncio.Queue()
        # Start workers
        for i in range(settings.MAX_CONCURRENT_TRANSLATIONS):
            worker_task = asyncio.create_task(translation_worker(i))
            worker_tasks.append(worker_task)

    translation_queue.put_nowait(job_id)

async def shutdown_background_tasks():
    """
    Gracefully shutdown background workers.
    """
    global translation_queue, worker_tasks
    if translation_queue is not None:
        # Send shutdown signal
        for _ in worker_tasks:
            translation_queue.put_nowait(None)
        await asyncio.gather(*worker_tasks, return_exceptions=True)
        worker_tasks.clear()
        translation_queue = None
    logger.info("All background tasks shut down.")
