import re

def validate_file_extension(ext: str) -> bool:
    """
    Validate allowed file extensions.
    """
    return ext in ['.md', '.docx', '.pdf']

def sanitize_language_code(lang: str) -> str:
    """
    Basic validation/sanitization of language code.
    Just ensures it's alphanumeric and short.
    """
    lang = lang.strip().lower()
    if not re.match(r'^[a-z]{2,5}$', lang):
        # fallback to 'en' if invalid
        return 'en'
    return lang
