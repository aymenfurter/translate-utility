import os
from fastapi import HTTPException
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest, ContentFormat, AnalyzeResult
from app.core.config import settings
import logging
import tempfile

logger = logging.getLogger(__name__)

def convert_to_markdown(file_path: str) -> str:
    """
    Convert the given file (MD, DOCX, or PDF) directly to Markdown using Azure Document Intelligence,
    requesting the output in Markdown format. If the file is already MD, just read it.

    Supported extensions: .md, .docx, .pdf
    """
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.md':
        # If it's already markdown, just return it directly
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.exception("Failed reading MD file.")
            raise HTTPException(status_code=500, detail="Failed to read MD file") from e

    if not settings.AZURE_DOC_INTELLIGENCE_ENDPOINT or not settings.AZURE_DOC_INTELLIGENCE_KEY:
        logger.error("Azure Document Intelligence credentials not configured")
        raise HTTPException(status_code=500, detail="Azure Document Intelligence credentials not configured")

    # Use Azure Document Intelligence to directly convert to markdown
    try:
        document_intelligence_client = DocumentIntelligenceClient(
            endpoint=settings.AZURE_DOC_INTELLIGENCE_ENDPOINT,
            credential=AzureKeyCredential(settings.AZURE_DOC_INTELLIGENCE_KEY)
        )

        with open(file_path, "rb") as f:
            file_bytes = f.read()

        # Request "prebuilt-layout" with markdown output
        poller = document_intelligence_client.begin_analyze_document(
            "prebuilt-layout",
            AnalyzeDocumentRequest(
                bytes_source=file_bytes
            ),
            output_content_format=ContentFormat.MARKDOWN
        )
        result: AnalyzeResult = poller.result()
        md_content = result.content

        return md_content

    except Exception as e:
        logger.exception("Azure Document Intelligence extraction to markdown failed")
        raise HTTPException(status_code=500, detail="Document extraction failed") from e
