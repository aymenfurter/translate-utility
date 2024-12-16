# Document Translation & Editing App

This application allows users to:

- Upload Markdown, Word, or PDF documents
- Convert to Markdown
- View chapters side-by-side
- Translate text using Azure OpenAI with context from adjacent chapters
- Edit the translated Markdown in a WYSIWYG editor
- Export the final translated Markdown

## Features

- **Single container**: The Docker image contains both the Python backend (FastAPI + Uvicorn) and the compiled frontend (React + Fluent UI + Vite).
- **Asynchronous translation**: Uses Azure OpenAI to translate text. Polling is used to track translation progress.
- **WYSIWYG Editing**: Refine translations before exporting.
- **Works locally or containerized**.

## Prerequisites

- Docker & Docker Compose (if using compose)
- Azure credentials for OpenAI and Document Intelligence
- Pandoc installed inside the container (already handled by Dockerfile)

## Local Development

1. **Backend**:
    ```bash
    pip install -r requirements.txt
    uvicorn app.main:app --host 0.0.0.0 --port 8000
    ```
    Now the backend runs at `http://localhost:8000`.

2. **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend runs at `http://localhost:3000` and proxies `/api` to `http://localhost:8000`.

3. Open `http://localhost:3000` in your browser.

## Build and Run with Docker

1. Build the container:
    ```bash
    docker build -t document-translation-app:latest .
    ```

2. Run the container:
    ```bash
    docker run -it --rm -p 8000:8000 --env-file .env document-translation-app:latest
    ```

3. Open `http://localhost:8000` in your browser. The frontend and backend are served from the same container.

## Environment Variables

Configure environment variables in `.env`:

- `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY`, `AZURE_OPENAI_MODEL`, `AZURE_OPENAI_API_VERSION`  
- `AZURE_DOC_INTELLIGENCE_ENDPOINT`, `AZURE_DOC_INTELLIGENCE_KEY`
- `ENV`, `TEMP_DIR`, `MAX_UPLOAD_SIZE`

Example in `.env.example`.

## Help & Support

Visit `/help` in the app for instructions. For troubleshooting or contributing, check the GitHub repository issues page.

