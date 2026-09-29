# Zobay Rank — SEO, AEO & GEO Optimization Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](#)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](#)
[![Tests](https://img.shields.io/badge/tests-125%20passed-emerald.svg)](#)

> Monorepo: FastAPI backend (`backend/`) + Next.js frontend (`frontend/`).

## What this is

- **SEO** — crawl, technical audit, issues, recommendations, action center, reports.
- **AEO** — AI-answer visibility: questions, citations, entities, monitoring, executive intelligence.
- **GEO** — generative-engine visibility: brand profiles, 18-category questions, competitors, monitoring.
- **Platform** — projects, scan lifecycle (`queued → initializing → crawling → analyzing → completed/failed/cancelled`), billing/credits, integrations, settings, notifications.

## Quick start (local)

```bash
# Backend
pip install -r backend/requirements.txt
uvicorn app.main:app --app-dir backend --reload --port 8000
# Frontend
cd frontend && npm install && npm run dev
```

- API: `http://localhost:8000/api/v1` · Swagger: `http://localhost:8000/api/v1/docs` · Health: `GET /health`
- App: `http://localhost:3000`

## Configuration (local)

| Variable | Default |
|---|---|
| `NEXT_PUBLIC_API_URL` (frontend, build-time) | `http://localhost:8000/api/v1` |
| `DATABASE_URL` (backend) | local SQLite file or local Postgres |
| `SECRET_KEY` | dev only — staging/production require a real secret (enforced at boot) |
| `CORS_ORIGINS` | localhost entries |

Full templates: `backend/.env.example`, `frontend/.env.example`. Never commit secrets.

## Authentication

- `Authorization: Bearer <signed JWT>` — signature + expiry verified, `sub` loaded from DB.
- Anonymous / invalid / expired → `401`. Cross-user resource access → `404`.
- All mutating routes require auth; reads are public in this POC cut.

## Tests

```bash
cd backend && python -m pytest app/tests      # 125 passed
cd frontend && npm run type-check && npm run build
```

New migrations: `alembic revision --autogenerate`, verify with `upgrade head` + `alembic check`.

## Docs

| Doc | What |
|---|---|
| [`prd.md`](prd.md) | Product requirements (canonical; `docs/prd.md` mirrors it) |
| [`docs/SECURITY_FIX_REPORT.md`](docs/SECURITY_FIX_REPORT.md) | Historical security/quality overhaul report |
| [`docs/OUT_OF_SCOPE_SECURITY_NOTES.md`](docs/OUT_OF_SCOPE_SECURITY_NOTES.md) | Explicitly deferred items |
| [`docs/AI_GEMINI_INTELLIGENCE.md`](docs/AI_GEMINI_INTELLIGENCE.md) | Gemini intelligence layer notes |

## For AI agents

- Stack: FastAPI + SQLAlchemy async + Next.js 15. Canonical auth dep: `get_current_user` in `backend/app/core/auth.py`. Never reintroduce `X-User-*` trust or latest-user fallback.
- Checks before claiming done: `pytest app/tests` (backend), `tsc --noEmit` (frontend). Separate observed vs inferred.
- Scope discipline: new work needs an explicit task. Migration changes require `alembic check` clean.

## License

Proprietary — The Fortune Group.
