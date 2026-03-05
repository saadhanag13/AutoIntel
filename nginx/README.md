# Nginx Setup

## How to run Nginx (Windows)

### Option A — Chocolatey (recommended)
```powershell
choco install nginx -y
```

### Option B — Manual
Download from https://nginx.org/en/download.html, extract to e.g. `C:\nginx`.

---

## Starting Nginx with this config

```powershell
# From anywhere — point nginx at the project's nginx.conf
nginx -c "C:\path\to\ai-analytics-platform\nginx\nginx.conf"
```

Or if installed via choco (runs from `C:\tools\nginx`):
```powershell
nginx -p C:\tools\nginx -c "C:\path\to\ai-analytics-platform\nginx\nginx.conf"
```

---

## Full dev startup order

```powershell
# 1. Backend (FastAPI) — port 8000
uvicorn backend.main:app --reload

# 2. Frontend (Next.js) — port 3000
cd frontend && npm run dev

# 3. Nginx — port 80 (proxies both above)
nginx -c "<absolute path>\nginx\nginx.conf"
```

Then open **http://localhost** (port 80) in the browser.

---

## Stopping Nginx

```powershell
nginx -s stop
```

## Reloading config without restart

```powershell
nginx -s reload
```

---

## What Nginx is doing

| Route prefix | Proxied to | Notes |
|---|---|---|
| `/ml/*` `/rag/*` `/llm/*` `/agent/*` `/data/*` `/kaggle/*` | `127.0.0.1:8000` (FastAPI) | CORS headers added here |
| Everything else | `127.0.0.1:3000` (Next.js) | HMR websocket supported |

CORS is **only** in Nginx. FastAPI has no `CORSMiddleware`.
