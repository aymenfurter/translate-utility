import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import HTTPException, Request
from app.routers import files, translate, status, export, health
from app.core.config import settings
from app.core.logging_config import configure_logging
from app.services.background import shutdown_background_tasks
from app.services.cleanup import periodic_cleanup_task
import asyncio
import logging

# Configure logging at startup
configure_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Document Translation & Editing API",
    description=(
        "Upload documents in MD/DOCX/PDF, convert them to Markdown, split into chapters, "
        "translate with context using Azure OpenAI, and then edit and export as Markdown."
    ),
    version="1.0.0"
)

# CORS configuration - Adjust origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include sub-routers
app.include_router(files.router, prefix="/api", tags=["files"])
app.include_router(translate.router, prefix="/api", tags=["translate"])
app.include_router(status.router, prefix="/api", tags=["status"])
app.include_router(export.router, prefix="/api", tags=["export"])
app.include_router(health.router, prefix="/api", tags=["health"])

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handle HTTPExceptions globally and return consistent JSON error responses.
    """
    logger.warning(f"HTTPException caught: {exc.detail} (Status: {exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Handle unexpected exceptions globally.
    """
    logger.exception("Unhandled exception occurred", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"},
    )

@app.on_event("startup")
async def startup_event():
    """
    Events executed at startup.
    """
    logger.info("Application starting up.")
    # Start periodic cleanup in background
    asyncio.create_task(periodic_cleanup_task(interval=3600))  # Every hour

@app.on_event("shutdown")
async def shutdown_event():
    """
    Events executed on shutdown.
    """
    logger.info("Application shutting down.")
    await shutdown_background_tasks()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
