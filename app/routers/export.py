from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import List
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class ChapterUpdate(BaseModel):
    id: str = Field(...)
    translated_markdown: str = Field(..., description="The edited/translated Markdown content")

class ExportRequest(BaseModel):
    chapters: List[ChapterUpdate] = Field(..., description="List of updated chapters in the final order")

@router.post("/export")
async def export_merged_markdown(req: ExportRequest):
    """
    Merge all translated chapters and return a single Markdown file as response.
    """
    if not req.chapters:
        raise HTTPException(status_code=400, detail="No chapters provided")
    final_md = []
    for ch in req.chapters:
        final_md.append(ch.translated_markdown.strip())
    merged = "\n\n".join(final_md)
    logger.info("Final markdown exported")
    return Response(content=merged, media_type="text/markdown")
