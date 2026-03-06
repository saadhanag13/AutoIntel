# AutoIntel — AI Analytics Platform

> **AutoML · RAG · Multi-Agent AI · Real-time Insights**
>
> Upload a CSV, train a full AutoML pipeline, get AI-generated insights, and chat with your data — all in one platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Environment Variables](#environment-variables)
   - [Running the Backend](#running-the-backend)
   - [Running the Frontend](#running-the-frontend)
   - [Running with Nginx](#running-with-nginx)
6. [API Reference](#api-reference)
7. [AutoML Pipeline](#automl-pipeline)
8. [RAG System](#rag-system)
9. [Agent System](#agent-system)
10. [Frontend Pages](#frontend-pages)
11. [Testing](#testing)

---

## Overview

AutoIntel is a full-stack AI analytics platform that takes raw CSV data through an end-to-end intelligent pipeline:

```
CSV Upload → Schema Detection → AutoML Training → Model Evaluation
         → AI Insight Generation → RAG-powered Chat Interface
```

Key capabilities:
- **AutoML** — automatically selects best-fit classification or regression models with optional GridSearch hyper-parameter tuning
- **RAG Chat** — ask natural language questions about your trained model results using a FAISS-backed retrieval pipeline
- **Multi-Agent AI** — specialised agents for analytics, data cleaning, ML prediction strategy, and insight generation
- **LLM Integration** — HuggingFace Inference Router with `meta-llama/Llama-3.1-8B-Instruct`

---

## Architecture

### Development (default — no Nginx needed)

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
└──────────────────────┬──────────────────────────────────┘
                       │ :3000
              ┌────────▼────────┐
              │    Next.js      │  ← rewrites + API routes
              │    Dev Server   │
              └────┬───────┬────┘
                   │       │
     next.config   │       │ /api/ml/train
     rewrites:     │       │  (custom route.ts
     /ml /rag /llm │       │   with 5-min timeout)
     /agent /data  │       │
                   ▼       ▼
              ┌──────────────┐
              │   FastAPI    │
              │    :8000     │
              └──────────────┘
```

### Production (with Nginx)

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
└──────────────────────┬──────────────────────────────────┘
                       │ :80
              ┌────────▼────────┐
              │     Nginx       │  ← CORS headers live here
              │  Reverse Proxy  │
              └────┬───────┬────┘
                   │       │
          /ml /rag │       │ everything else
          /llm     │       │
          /agent   │       │
                   ▼       ▼
         ┌──────────┐ ┌──────────┐
         │ FastAPI  │ │ Next.js  │
         │  :8000   │ │  :3000   │
         └──────────┘ └──────────┘
```

### API Route Map

```
/ml/upload       → Next.js rewrite  → FastAPI :8000  (file upload)
/api/ml/train    → Next.js API route → FastAPI :8000  (long-running, 5-min timeout)
/rag/*           → Next.js rewrite  → FastAPI :8000  (RAG queries)
/llm/*           → Next.js rewrite  → FastAPI :8000  (LLM generation)
/agent/*         → Next.js rewrite  → FastAPI :8000  (CrewAI agents)
/data/*          → Next.js rewrite  → FastAPI :8000  (data service)
```

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Web framework | FastAPI + Uvicorn |
| ML / AutoML | scikit-learn, numpy, pandas |
| LLM client | HuggingFace Inference Router (`meta-llama/Llama-3.1-8B-Instruct`) |
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`) |
| Vector store | FAISS (faiss-cpu) |
| Config | pydantic-settings, python-dotenv |
| Reverse proxy | Nginx (CORS handled at proxy layer) |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (glassmorphism design system) |
| State | React Context (`AppContext`) |
| Fonts | Syne, DM Sans, JetBrains Mono (Google Fonts) |

---

## Project Structure

```
ai-analytics-platform/
│
├── backend/                    # FastAPI application
│   ├── main.py                 # App entry point, router registration
│   ├── api/
│   │   └── routes/             # Route handlers
│   │       ├── ml_routes.py    # POST /ml/upload, POST /ml/train
│   │       ├── rag_routes.py   # POST /rag/query
│   │       ├── llm_routes.py   # GET /llm/generate
│   │       ├── agent_routes.py # GET /agent/run
│   │       ├── data_routes.py
│   │       └── kaggle_routes.py
│   ├── services/
│   │   ├── hf_client.py        # HuggingFace Inference Router client
│   │   ├── llm_service.py      # Session-aware LLM response builder
│   │   ├── ml_service.py       # Bridges routes → ml_engine
│   │   ├── insight_service.py
│   │   └── data_service.py
│   ├── llm/
│   │   └── prompt_builder.py   # System prompt / message construction
│   ├── memory/
│   │   ├── session_memory.py   # Per-session conversation history
│   │   └── memory_store.py
│   └── storage/
│       ├── temp_dataset.pkl    # Uploaded dataset (runtime)
│       └── temp_report.json   # Latest training report (runtime)
│
├── ml_engine/                  # AutoML core
│   ├── engine.py               # Orchestrates the full pipeline
│   ├── model_selector.py       # Picks classification / regression models
│   ├── trainer.py              # Trains + GridSearch + evaluates
│   ├── evaluator.py            # Metric computation
│   └── model_saver.py          # Persists best model to saved_models/
│
├── data_processing/
│   ├── schema_detector.py      # Infers column types (numeric/cat/datetime)
│   ├── preprocessor.py         # Encoding, imputation, scaling
│   └── ...
│
├── rag/
│   └── rag_src/
│       ├── retriever.py         # Main RAG query handler
│       ├── rag_service.py       # Service layer
│       ├── vector_store.py      # FAISS vector index wrapper
│       ├── embeddings.py        # sentence-transformers encoder
│       ├── chunker.py           # Text chunking strategy
│       ├── doc_loader.py        # Text document loader
│       ├── uploader.py          # Ingest docs into FAISS index
│       └── rag_agent.py
│
├── agents/                     # Agent definitions
│   ├── agent_manager.py        # Routes prompts to the right agent
│   ├── orchestrator.py         # Master orchestrator
│   ├── analytics_agent.py      # Trend & performance analysis
│   ├── ml_pred_agent.py        # ML prediction strategy advisor
│   ├── data_clean_agent.py     # Data cleaning advisor
│   ├── insight_agent.py        # Insight & explanation agent
│   └── base_agent.py
│
├── insights/                   # Post-training insight generation
│
├── frontend/                   # Next.js application
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Sidebar + scroll container)
│   │   ├── page.tsx            # Redirect → /dashboard
│   │   ├── dashboard/page.tsx  # Main AutoML dashboard
│   │   ├── insights/page.tsx   # Insights page
│   │   ├── agents/page.tsx     # Agents showcase page
│   │   └── api/
│   │       └── ml/train/
│   │           └── route.ts    # Custom proxy for /ml/train (5-min timeout)
│   ├── components/
│   │   ├── sidebar.tsx         # Navigation + Train Model control
│   │   ├── uploadPanel.tsx     # CSV upload UI (200 MB limit, 16 KB preview)
│   │   ├── KPIcard.tsx         # Model results KPI cards
│   │   ├── Modelcompchart.tsx  # Model comparison charts
│   │   ├── InsightsPanel.tsx   # AI insights display
│   │   ├── chatpanel.tsx       # RAG chat interface
│   │   └── SectionLabel.tsx    # Step section label
│   ├── context/
│   │   └── AppContext.tsx      # Global state (phase, report, columns…)
│   ├── lib/
│   │   └── api.ts              # Typed fetch wrappers for all API routes
│   └── types/
│       └── api.ts              # TypeScript types (TrainResponse, etc.)
│
├── nginx/
│   ├── nginx.conf              # Reverse proxy + CORS configuration
│   └── README.md               # Nginx setup instructions
│
├── tests/                      # Python test suite
├── saved_models/               # Persisted trained models (runtime)
├── requirements.txt            # Python dependencies (exact versions)
└── .env                        # Environment variables (not committed)
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Python | ≥ 3.10 |
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Nginx | any recent stable (optional, for proxy setup) |

### Environment Variables

Create a `.env` file in the project root:

```env
HF_TOKEN=hf_your_huggingface_token_here
```

Get your token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).  
The model used is `meta-llama/Llama-3.1-8B-Instruct` via the HF Serverless Inference Router.

### Running the Backend

```powershell
# Create and activate venv
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start FastAPI (MUST be run from the project root, not frontend/)
uvicorn backend.main:app --reload
# → http://127.0.0.1:8000
# → Interactive docs: http://127.0.0.1:8000/docs
```

> **⚠ Windows note:** `main.py` sets `LOKY_MAX_CPU_COUNT=1` at startup to prevent
> joblib/loky subprocess crashes inside the ASGI process. If you see
> `BrokenProcessPool` errors, restart uvicorn (hot-reload alone won't re-read env vars).

### Running the Frontend

```powershell
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

In dev mode, **only these two terminals are needed**. Next.js rewrites (configured in
`next.config.ts`) transparently proxy all API routes (`/ml/*`, `/rag/*`, `/llm/*`,
`/agent/*`) to FastAPI on port 8000. The `/ml/train` endpoint uses a custom API route
(`app/api/ml/train/route.ts`) with a 5-minute timeout since Next.js rewrites have a
30-second limit.

### Running with Nginx

Nginx acts as the single entry point on port 80, handling CORS and proxying to both services.

```powershell
# 1. Start FastAPI (port 8000)
uvicorn backend.main:app --reload

# 2. Start Next.js (port 3000)
cd frontend; npm run dev

# 3. Start Nginx (port 80)
nginx -c "<absolute-path>\nginx\nginx.conf"
```

Then open **http://localhost** in the browser.

```powershell
# Reload config without restart
nginx -s reload

# Stop
nginx -s stop
```

> See [`nginx/README.md`](nginx/README.md) for full Nginx setup instructions.

---

## API Reference

All routes are prefixed and served through Nginx. Replace `http://localhost` with `http://127.0.0.1:8000` when calling FastAPI directly.

### ML Routes — `/ml`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ml/upload` | Upload a CSV file. Returns `columns[]` and `rows` count. |
| `POST` | `/ml/train?target_column=<col>` | Run the AutoML pipeline against the uploaded dataset. Returns full training report. |

**Upload response:**
```json
{
  "message": "Dataset uploaded successfully",
  "columns": ["col1", "col2", "..."],
  "rows": 1234
}
```

**Train response (abbreviated):**
```json
{
  "best_model": "RandomForestClassifier",
  "problem_type": "classification",
  "results": {
    "RandomForestClassifier": { "Accuracy": 0.94 },
    "LogisticRegression":     { "Accuracy": 0.87 }
  },
  "insights": ["..."],
  "feature_importance": { "col1": 0.42, "col2": 0.31 }
}
```

### RAG Routes — `/rag`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/rag/query` | Natural language query against the vector store. |

**Request:**
```json
{ "query": "Which model had the highest accuracy?" }
```

### LLM Routes — `/llm`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/llm/generate?prompt=<text>` | Direct LLM completion. |

### Agent Routes — `/agent`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/agent/run?prompt=<text>` | Dispatches to the appropriate CrewAI agent based on the prompt. |

**Example prompts:**
```
/agent/run?prompt=Analyze sales performance
/agent/run?prompt=Predict revenue for next quarter
/agent/run?prompt=How to handle missing values
/agent/run?prompt=Explain customer churn patterns
```

---

## AutoML Pipeline

The pipeline is orchestrated by `ml_engine/engine.py` and runs the following steps:

```
1. Schema Detection      data_processing/schema_detector.py
   └── Classify columns as numeric / categorical / datetime

2. Preprocessing         data_processing/preprocessor.py
   ├── Label encoding for categoricals
   ├── Median imputation for nulls
   └── Standard scaling for numerics

3. Problem Type Detection
   └── Classification if target has ≤ N unique values, else Regression

4. Model Selection       ml_engine/model_selector.py
   ├── Classification: LogisticRegression, RandomForest, GradientBoosting
   │   (advanced adds: SVC, KNeighbors, DecisionTree, AdaBoost)
   └── Regression:     LinearRegression, Ridge, RandomForest,
                       GradientBoosting

5. Training              ml_engine/trainer.py
   ├── Fast mode  → direct fit (default, recommended on Windows)
   ├── Advanced   → GridSearchCV with Stratified/KFold CV (n_jobs=1)
   └── Per-model try/except → one failed model doesn't crash the run

6. Evaluation            ml_engine/evaluator.py
   ├── Classification: Accuracy, Precision, Recall, F1, Confusion Matrix
   └── Regression:     R², MAE, RMSE

7. Model Persistence     ml_engine/model_saver.py
   └── Saves best model to saved_models/

8. Report + RAG context
   └── Writes temp_report.json → used by RAG retriever for chat context
```

---

## RAG System

The RAG pipeline (`rag/rag_src/`) enables natural language Q&A over your training results and any ingested documents.

```
User Query
  → embeddings.py      (encode with sentence-transformers)
  → vector_store.py    (similarity search in FAISS)
  → retriever.py       (fetch relevant chunks + training report context)
  → hf_client.py       (send augmented prompt to LLM)
  → Response
```

**Model:** `meta-llama/Llama-3.1-8B-Instruct` via HuggingFace Inference Router  
**Vector store:** FAISS (faiss-cpu, in-memory index)  
**Embeddings:** `sentence-transformers` (`all-MiniLM-L6-v2`)

---

## Agent System

Agents are routed by `agents/agent_manager.py`:

| Agent | File | Purpose |
|---|---|---|
| Analytics Agent | `analytics_agent.py` | Analyse data, explain patterns, generate reports |
| ML Prediction Agent | `ml_pred_agent.py` | Prediction strategies and model selection advice |
| Data Cleaning Agent | `data_clean_agent.py` | Missing values, outliers, preprocessing guidance |
| Insight Agent | `insight_agent.py` | Deep-dive explanations of model outputs and trends |

The **orchestrator** (`orchestrator.py`) coordinates multi-agent tasks when a single agent is insufficient.

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Redirect | Redirects to `/dashboard` |
| `/dashboard` | Dashboard | Upload → Train → Results → Chat (full pipeline UI) |
| `/insights` | Insights | Detailed AI insights view |
| `/agents` | Agents | Agent capabilities showcase |

### Dashboard Flow

```
01 Tensor Ingestion       UploadPanel
        ↓ (on upload)
   [Sidebar] Select target column → Train Model
        ↓ (training)
   Training spinner (amber)
        ↓ (complete) ← page auto-scrolls to top of results
02 Global Architecture Results    KPICards
03 Performance Telemetry          Charts
04 Strategic Analytics            InsightsPanel
05 Chat Interface                 ChatPanel (RAG)
```

### State Machine (`AppContext`)

```
"empty" → "uploaded" → "training" → "trained"
               ↑_______________↓
             (on train error: back to "uploaded")
```
---

## Notes

- **Dev mode needs only 2 terminals** — uvicorn + Next.js. Nginx is optional (production only).
- **CORS** is not needed in dev (same-origin via Next.js proxy). In production, `CORSMiddleware` is enabled in FastAPI (controlled via `ALLOWED_ORIGINS` env var). Nginx also handles CORS when used.
- **Upload limit** — 200 MB (enforced client-side in `uploadPanel.tsx` and server-side via Nginx `client_max_body_size`). Preview reads only the first 16 KB.
- **Training timeout** — the `/api/ml/train` API route has a 5-minute timeout. In Nginx, `proxy_read_timeout 300s` is set.
- **Windows / joblib** — `LOKY_MAX_CPU_COUNT=1` is set in `main.py` and `ml_service.py` to prevent `BrokenProcessPool` crashes. All RandomForest models use `n_jobs=1`.
- **Per-model fault tolerance** — if any single model crashes during training (e.g. convergence failure), it is skipped and the remaining models continue. Results are returned from whichever models succeeded.
- The uploaded dataset is stored as `backend/storage/temp_dataset.pkl` and persists until the next upload.
- The latest training report is saved to `backend/storage/temp_report.json` and used as RAG context for the chat interface.