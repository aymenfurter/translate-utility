import time
import logging
import asyncio
from app.services.storage import DOCS, JOBS

logger = logging.getLogger(__name__)

async def periodic_cleanup_task(interval: int = 3600):
    """
    Periodically clean up old documents and jobs from memory.
    This simulates a 'production-ready' approach where stale data is removed.
    """
    while True:
        await asyncio.sleep(interval)
        cleanup_stale_data()

def cleanup_stale_data(max_age: int = 86400):
    """
    Clean up data older than `max_age` seconds (24h default).
    """
    now = time.time()
    keys_to_delete = []
    for k, v in DOCS.items():
        if (now - v["created_at"]) > max_age:
            keys_to_delete.append(k)
    for k in keys_to_delete:
        del DOCS[k]
        logger.info(f"Removed stale doc {k}")

