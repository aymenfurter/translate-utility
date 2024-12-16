from openai import AzureOpenAI
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

client = AzureOpenAI(
    api_key=settings.AZURE_OPENAI_KEY,
    api_version=settings.AZURE_OPENAI_API_VERSION,
    azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
    default_headers={"Accept-Encoding": "gzip, deflate"},
    timeout=30.0
)

def translate_text_with_context(text: str, context_before: str, context_after: str, target_language: str) -> str:
    """
    Uses Azure OpenAI to translate text.
    Provides context (previous and next chapter) to improve accuracy.
    """
    prompt = (
        f"Translate the following text into {target_language}. "
        "Maintain all markdown formatting, including figures, tables, and special characters. "
        "Do not modify or remove any HTML or Markdown syntax elements. "
        "Do not come up with your own content, only translate the existing text. "
        "Keep all formatting tags and structure intact.\n\n"
        f"Context Before:\n{context_before}\n\n"
        f"Text to translate:\n{text}\n\n"
        f"Context After:\n{context_after}\n\n"
        "Translated Text:"
    )
    try:
        response = client.chat.completions.create(
            model=settings.AZURE_OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=4000  # Increased token limit to handle larger texts
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.exception("AOAI Translation failed")
        return "Translation failed due to an internal error."
