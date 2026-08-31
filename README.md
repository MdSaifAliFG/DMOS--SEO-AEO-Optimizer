# DMOS SEO & AEO Optimization Platform (Phase 1)

[![Phase](https://img.shields.io/badge/Phase-1%20Complete-emerald.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](#)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](#)

> **Phase 1 Implementation**: Core Platform Architecture, Monorepo Setup, Dashboard Shell, PostgreSQL Database Models, FastAPI REST APIs under `/api/v1`, and Asynchronous Scan Lifecycle State Machine (`queued` → `initializing` → `crawling` → `analyzing` → `completed` / `failed` / `cancelled`).

---

## 📌 Phase 1 PRD Compliance & Boundaries

In strict adherence to the Phase 1 PRD:
- ❌ **No fake SEO scores or synthetic domain ratings** are generated.
- ❌ **No external SEO APIs** (Ahrefs, Semrush, DataForSEO, Google Search Console, Google Analytics) are called in Phase 1.
- ❌ **No AI API keys** are required in Phase 1.
- ✅ **Extensible Architecture**: Clean slots and schemas are prepared so Phase 2 modules (Keyword Tracking, Competitor Matrix, AEO/LLM Search Intelligence) can be integrated seamlessly.
- ✅ **Scan Lifecycle Engine**: The audit feature demonstrates the end-to-end asynchronous crawler orchestration lifecycle with real-time stage transitions, telemetry, and live execution event logs.

---

## 🏗️ Architecture & Monorepo Structure

```
dmos-seo-aeo/
├── docker-compose.yml              # Multi-container orchestration (Postgres, Redis, Backend, Frontend)
├── README.md                       # Comprehensive documentation
├── .gitignore                      # Monorepo gitignore
├── backend/                        # FastAPI + SQLAlchemy Backend
│   ├── .env.example                # Backend environment template
│   ├── .env                        # Local development environment configuration
│   ├── requirements.txt            # Python dependencies
│   ├── pyproject.toml              # Build & test configuration
│   ├── Dockerfile                  # Container definition
│   ├── alembic.ini                 # Database migrations configuration
│   ├── alembic/                    # Alembic migration scripts
│   └── app/
│       ├── main.py                 # FastAPI app entry point & lifespan
│       ├── core/
│       │   ├── config.py           # Pydantic Settings
│       │   ├── database.py         # SQLAlchemy async engine & session
│       │   └── redis.py            # Redis client & connection pool
│       ├── models/                 # SQLAlchemy ORM Models
│       │   ├── user.py             # User model
│       │   ├── project.py          # Project model
│       │   └── scan.py             # Scan execution model
│       ├── schemas/                # Pydantic v2 Request/Response schemas
│       │   ├── project.py          # Project schemas with domain validator
│       │   └── scan.py             # Scan schemas & log structures
│       ├── services/               # Business Logic Layer
│       │   ├── project_service.py  # Project CRUD & queries
│       │   ├── scan_service.py     # Scan dispatch & cancellation
│       │   └── scan_runner.py      # Async scan lifecycle state machine
│       ├── api/v1/                 # REST API Routers
│       │   ├── router.py           # Aggregate v1 router
│       │   └── endpoints/
│       │       ├── health.py       # GET /api/v1/health
│       │       ├── projects.py     # Projects & Scan dispatch endpoints
│       │       └── scans.py        # Scan status & cancellation endpoints
│       └── tests/                  # Pytest test suite
│           ├── test_health.py      # Health check tests
│           ├── test_projects.py    # Project CRUD tests
│           └── test_scans.py       # Scan lifecycle & cancel tests
└── frontend/                       # Next.js 15 App Router Frontend
    ├── .env.example                # Frontend environment template
    ├── .env.local                  # Local API URL configuration
    ├── package.json                # Node dependencies & scripts
    ├── tsconfig.json               # TypeScript configuration
    ├── tailwind.config.ts          # Custom dark modern design theme
    ├── Dockerfile                  # Production container definition
    └── src/
        ├── app/                    # Next.js App Router Pages
        │   ├── layout.tsx          # Root Layout & ToastProvider
        │   ├── page.tsx            # Root redirect to /dashboard
        │   ├── dashboard/page.tsx  # Executive metrics & project overview
        │   ├── projects/
        │   │   ├── page.tsx        # Project directory
        │   │   ├── new/page.tsx    # Add Website page
        │   │   └── [id]/
        │   │       ├── page.tsx    # Project Overview & scan history
        │   │       └── audit/      # Interactive scan lifecycle cockpit
        │   ├── keywords/page.tsx   # Coming Soon (Phase 2)
        │   ├── competitors/        # Coming Soon (Phase 2)
        │   ├── aeo-insights/       # Coming Soon (Phase 2)
        │   └── settings/page.tsx   # System settings (Phase 2)
        ├── components/
        │   ├── layout/             # Header, Sidebar, MobileNav, DashboardShell
        │   ├── ui/                 # Button, Card, Input, Badge, Modal, Skeleton, Toast
        │   ├── projects/           # ProjectCard, ProjectList, ProjectForm, DeleteModal
        │   └── scans/              # ScanStatusBadge, ScanProgressTracker, ScanLogsViewer, StartAuditModal
        ├── lib/
        │   ├── api-client.ts       # Type-safe API service layer
        │   ├── types.ts            # TypeScript interfaces
        │   ├── constants.ts        # Navigation config & status colors
        │   └── utils.ts            # Date formatters & class utilities
        └── hooks/
            └── useToast.ts         # Toast notification hook
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm 9+
- Docker & Docker Compose (optional for containerized setup)

---

### Option A: Docker Compose (Full Stack with PostgreSQL & Redis)

To run the complete platform including PostgreSQL, Redis, FastAPI backend, and Next.js frontend:

```bash
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend Docs: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)

---

### Option B: Local Development Setup

#### 1. Backend Setup

```bash
# Navigate to root and create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start backend development server (defaults to local async SQLite or PostgreSQL from .env)
uvicorn app.main:app --app-dir backend --reload --port 8000
```

Backend endpoints:
- API Base: `http://localhost:8000/api/v1`
- Swagger UI: `http://localhost:8000/api/v1/docs`
- Health Check: `http://localhost:8000/api/v1/health`

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup & Configuration

### PostgreSQL Connection
Configure your PostgreSQL URL in `backend/.env`:
```env
DATABASE_URL=postgresql+psycopg://dmos_user:dmos_secret_password@localhost:5432/dmos_seo_aeo
SYNC_DATABASE_URL=postgresql+psycopg://dmos_user:dmos_secret_password@localhost:5432/dmos_seo_aeo
```

### Zero-Dependency Local SQLite Mode
By default, the backend is configured with async SQLite for instantaneous zero-setup testing:
```env
DATABASE_URL=sqlite+aiosqlite:///./dmos_dev.db
SYNC_DATABASE_URL=sqlite:///./dmos_dev.db
```

### Database Models

| Model | Table | Key Fields | Description |
|---|---|---|---|
| **User** | `users` | `id`, `email`, `full_name`, `is_active`, `is_superuser`, timestamps | Platform user account model |
| **Project** | `projects` | `id`, `user_id`, `name`, `domain`, `description`, `settings`, `is_active`, timestamps | Website domain registered for SEO/AEO monitoring |
| **Scan** | `scans` | `id`, `project_id`, `target_url`, `scan_type`, `status`, `progress`, `current_step`, `logs`, `meta_data`, `error_message`, `started_at`, `completed_at`, timestamps | Audit scan execution lifecycle instance |

---

## 📡 REST API Reference (`/api/v1`)

### Health
- `GET /api/v1/health` - Check database & Redis connectivity.

### Projects
- `POST /api/v1/projects` - Register a new website project (with domain validation & deduplication).
- `GET /api/v1/projects` - List all projects with search & pagination.
- `GET /api/v1/projects/{project_id}` - Fetch single project with latest scan summary.
- `PATCH /api/v1/projects/{project_id}` - Update project metadata or settings.
- `DELETE /api/v1/projects/{project_id}` - Delete project and all associated scan history.

### Scans
- `POST /api/v1/projects/{project_id}/scans` - Launch a new audit scan lifecycle.
- `GET /api/v1/projects/{project_id}/scans` - List past scans for a project.
- `GET /api/v1/scans/{scan_id}` - Real-time scan progress, stage status, and event logs.
- `POST /api/v1/scans/{scan_id}/cancel` - Cancel an in-flight scan execution.

---

## 🧪 Testing Suite

### Backend Pytest Tests
```bash
.venv\Scripts\pytest backend/app/tests -v
```
Runs 8 automated tests validating:
- Health check and root endpoint
- Project creation, domain normalization, duplicate rejection, search, deletion
- Scan lifecycle creation, query, progress updates, and user cancellation

### Frontend TypeScript Check & Build
```bash
cd frontend
npm run type-check
npm run build
```

---

## 🔄 Scan Lifecycle State Machine

The Phase 1 scan execution engine transitions through the following stages:

```mermaid
stateDiagram-v2
    [*] --> queued: POST /projects/{id}/scans
    queued --> initializing: Worker Picked Up
    initializing --> crawling: DNS & Robots Verified
    crawling --> analyzing: HTML & Links Discovered
    analyzing --> completed: Lifecycle Finished
    
    queued --> cancelled: POST /scans/{id}/cancel
    initializing --> cancelled: POST /scans/{id}/cancel
    crawling --> cancelled: POST /scans/{id}/cancel
    analyzing --> cancelled: POST /scans/{id}/cancel
    
    initializing --> failed: Error / Unreachable
    crawling --> failed: Error / Exception
    analyzing --> failed: Error / Exception
```

---

## 🛡️ License
DMOS SEO & AEO Optimization Platform - Proprietary.
