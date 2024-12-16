from fastapi import APIRouter, File, UploadFile, HTTPException
from uuid import uuid4
from app.services.conversion import convert_to_markdown
from app.services.splitting import split_markdown_into_chapters
from app.services.storage import store_doc
from app.services.validation import validate_file_extension
import os
import tempfile
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/upload") 
async def upload_file(file: UploadFile = File(...)):
    """
    Uploads a file (MD/DOCX/PDF), converts it to Markdown, splits into chapters,
    and returns a session_id and the chapters metadata.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if not validate_file_extension(ext):
        raise HTTPException(status_code=400, detail="Unsupported file type. Must be .md, .docx, or .pdf")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        md_content = convert_to_markdown(tmp_path)
        chapters = split_markdown_into_chapters(md_content)
        session_id = str(uuid4())
        store_doc(session_id, chapters)

        logger.info(f"File {file.filename} uploaded, converted, and stored as session {session_id}")
        return {"session_id": session_id, "chapters": chapters}

    except Exception as e:
        logger.exception("Error during file upload or conversion")
        raise HTTPException(status_code=500, detail="Failed to process file") from e
    finally:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)
