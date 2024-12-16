from pydantic import BaseModel, field_validator, ValidationError
import os
from typing import Optional
from dotenv import load_dotenv
import sys
from pathlib import Path

# Find and load the .env file
env_path = Path(__file__).parent.parent / '.env'
if not env_path.exists():
    print(f"ERROR: .env file not found at {env_path}")
    sys.exit(1)
load_dotenv(env_path)

class Settings(BaseModel):
    ENV: str = "development"

    # Azure OpenAI
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT", "https://your-aoai-endpoint.openai.azure.com")
    AZURE_OPENAI_KEY: str = os.getenv("AZURE_OPENAI_KEY", "your-aoai-key")
    AZURE_OPENAI_MODEL: str = os.getenv("AZURE_OPENAI_MODEL", "gpt-4")
    AZURE_OPENAI_API_VERSION: str = os.getenv("AZURE_OPENAI_API_VERSION", "2023-03-15-preview")
    MAX_CONCURRENT_TRANSLATIONS: int = 5

    # Azure Document Intelligence
    AZURE_DOC_INTELLIGENCE_ENDPOINT: str = os.getenv("DOCUMENTINTELLIGENCE_ENDPOINT", "")
    AZURE_DOC_INTELLIGENCE_KEY: str = os.getenv("DOCUMENTINTELLIGENCE_API_KEY", "")

    PANDOC_PATH: str = "pandoc"
    TEMP_DIR: str = "/tmp/doc-processing"
    MAX_UPLOAD_SIZE: int = 40 * 1024 * 1024

    @field_validator('TEMP_DIR')
    @classmethod
    def create_temp_dir(cls, v):
        os.makedirs(v, exist_ok=True)
        return v

    @field_validator('AZURE_DOC_INTELLIGENCE_ENDPOINT', 'AZURE_DOC_INTELLIGENCE_KEY')
    @classmethod
    def validate_doc_intelligence(cls, v, field):
        if not v or len(v.strip()) == 0:
            print(f"ERROR: {field.name} is not configured properly in {env_path}")
            sys.exit(1)
        return v.strip()

    @field_validator('AZURE_OPENAI_KEY')
    @classmethod
    def validate_openai_key(cls, v):
        if v == "your-aoai-key":
            print("ERROR: AZURE_OPENAI_KEY is not configured in environment")
            sys.exit(1)
        return v

    @field_validator('AZURE_OPENAI_ENDPOINT')
    @classmethod
    def validate_openai_endpoint(cls, v):
        if v == "https://your-aoai-endpoint.openai.azure.com":
            print("ERROR: AZURE_OPENAI_ENDPOINT is not configured in environment")
            sys.exit(1)
        return v

    model_config = {
        "arbitrary_types_allowed": True
    }

try:
    settings = Settings()
    # Verify credentials work by doing a basic validation
    if len(settings.AZURE_DOC_INTELLIGENCE_KEY) < 10:
        print("ERROR: AZURE_DOC_INTELLIGENCE_KEY appears to be invalid")
        sys.exit(1)
except Exception as e:
    print(f"Failed to load configuration: {str(e)}")
    sys.exit(1)
