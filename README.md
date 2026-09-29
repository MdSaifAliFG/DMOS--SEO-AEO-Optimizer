# Zobay Rank — SEO, AEO & GEO Optimization Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](#)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](#)
[![Tests](https://img.shields.io/badge/tests-125%20passed-emerald.svg)](#)

> Monorepo: FastAPI backend (`backend/`) + Next.js frontend (`frontend/`).
> Live DEV: frontend `https://dev.rank.zobay.in` → API `https://api.dev.rank.zobay.in`.

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

## Configuration (the only variable that matters per environment)

| Variable | Local | DEV/POC |
|---|---|---|
| `NEXT_PUBLIC_API_URL` (frontend, build-time) | `http://localhost:8000/api/v1` | `https://api.dev.rank.zobay.in/api/v1` |
| `DATABASE_URL` (backend) | SQLite dev file or local Postgres | Managed Postgres (`postgresql+psycopg://…`) |
| `SECRET_KEY` | anything (dev) | required, non-default (enforced at boot) |
| `CORS_ORIGINS` | localhost entries | `["https://dev.rank.zobay.in"]` — never `*` |
| `ENVIRONMENT` | `development` | `development`/`staging` (never call POC `production`) |

Full templates: `backend/.env.example`, `frontend/.env.example`. Never commit secrets.

## Authentication (DEV/POC boundary)

- `Authorization: Bearer <signed JWT>` — signature + expiry verified, `sub` loaded from DB.
- Anonymous / invalid / expired → `401`. Cross-user resource access → `404`. No header-trust, no fallback user.
- All mutating routes (projects, AEO, GEO, SEO actions, billing, settings, integrations, scan cancel) require auth.
- DEV-only bootstrap `POST /api/v1/dev/auth/token` (gated by `ENVIRONMENT` + `DEV_AUTH_SECRET`); absent in staging/production.

## Tests

```bash
cd backend && python -m pytest app/tests      # 125 passed
cd frontend && npm run type-check && npm run build
```

New migrations: `alembic revision --autogenerate`, verify with `upgrade head` + `alembic check`.

## Deploy (DEV/POC)

- Backend image: `docker build -t rank-api:v0.1.0 backend/` (non-root, `/health` check, workers=2).
- K3s manifests: `backend/deploy/k8s/` (`rank-dev` namespace, migration Job, Deployment + ClusterIP + Traefik Ingress, secret template).
- Sequence: Postgres → `alembic upgrade head` → migrate Job → Deployment → `/health` → JWT smoke → scan E2E.
- Details: [`docs/DEV_DEPLOYMENT.md`](docs/DEV_DEPLOYMENT.md).

## Docs

| Doc | What |
|---|---|
| [`prd.md`](prd.md) | Product requirements (canonical; `docs/prd.md` mirrors it) |
| [`docs/DEV_DEPLOYMENT.md`](docs/DEV_DEPLOYMENT.md) | DEV deploy gates + K3s sequence |
| [`docs/SECURITY_FIX_REPORT.md`](docs/SECURITY_FIX_REPORT.md) | Historical security/quality overhaul report |
| [`docs/OUT_OF_SCOPE_SECURITY_NOTES.md`](docs/OUT_OF_SCOPE_SECURITY_NOTES.md) | Explicitly deferred items |
| [`docs/AI_GEMINI_INTELLIGENCE.md`](docs/AI_GEMINI_INTELLIGENCE.md) | Gemini intelligence layer notes |

## For AI agents

- Stack: FastAPI + SQLAlchemy async + Next.js 15. Canonical auth dep: `get_current_user` in `backend/app/core/auth.py`. Never reintroduce `X-User-*` trust or latest-user fallback.
- Checks before claiming done: `pytest app/tests` (backend), `tsc --noEmit` (frontend). Separate observed vs inferred.
- Scope discipline: DEV/POC hardening is frozen; new work needs an explicit task. Migration changes require `alembic check` clean.

## License

Proprietary — The Fortune Group.
