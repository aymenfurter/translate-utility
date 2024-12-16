<div align="center">

# Document Translation & Editing App

<p align="center">
  <img src="https://img.shields.io/github/last-commit/aymenfurter/translate-utility" alt="Last Commit" />
  <img src="https://img.shields.io/github/license/aymenfurter/translate-utility" alt="License" />
</p>

A document translation tool that leverages Azure OpenAI Service and Azure Document Intelligence.

<img src="https://raw.githubusercontent.com/aymenfurter/translate-utility/main/screen2.png" width="800" alt="Main Interface" />

</div>

## 🚀 Key Features

- 📚 Upload text-based documents (Markdown, Word*, or PDF*)
- 🔄 Automatic conversion to plain Markdown
- 👀 Side-by-side chapter view
- 🤖 Azure OpenAI powered translations with context awareness
- ✏️ Editor for translation refinement
- 💾 Export final translations

<div align="center">
  <img src="https://raw.githubusercontent.com/aymenfurter/translate-utility/main/screen1.png" width="800" alt="Translation Interface" />
</div>

> **Note:** This tool is optimized for text-based content only. Documents containing images, graphs, diagrams, or complex formatting will be converted to plain Markdown text. Images and rich media content are not preserved in the translation process.

## ⚡ Technical Highlights

- **All-in-One Container**: Single Docker image with Python backend (FastAPI + Uvicorn) and compiled frontend (React + Fluent UI + Vite)
- **Smart Translation**: Asynchronous translation using Azure OpenAI with context from adjacent chapters

## 🔧 Prerequisites

- Docker
- Azure OpenAI and Document Intelligence credentials

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
