# DEV Deployment (POC)

> Target: `rank-dev` namespace on the existing K3s node (Traefik already present).
> Do not touch `calendar`, `meet`, or global Traefik config.

## Order of gates

1. DEV PostgreSQL credentials on the VPS (shell/secret only — never chat, never git).
2. `alembic upgrade head` → `alembic current` (must equal head) → `alembic check` (clean).
3. Build/push image: `docker build -t rank-api:v0.1.0 backend/` (local-only tag needs `imagePullPolicy: Never` or a registry).
4. `kubectl apply --dry-run=server -f backend/deploy/k8s/` then for real:
   namespace → Secret (`rank-api-secrets`, see `secret.example.yaml`) → migration Job →
   Deployment → Service → Ingress.
5. `kubectl logs job/rank-api-migrate -n rank-dev` must show a completed migration.
6. Pods `READY 1/1`; `curl -i https://api.dev.rank.zobay.in/health` → 200.
7. JWT smoke: dev token → create project → read → trigger scan → results; verify cross-user 404.
8. Frontend (`dev.rank.zobay.in`, Vercel): full browser journey against the API.

## Env contract

- `ENVIRONMENT=development`, `DEBUG=false`, `SKIP_STARTUP_DDL=true`
- Secret keys: `DATABASE_URL` (`postgresql+psycopg://…`), `SYNC_DATABASE_URL` (`postgresql://…`),
  `SECRET_KEY`, `DEV_AUTH_SECRET`, `CORS_ORIGINS='["https://dev.rank.zobay.in"]'`, `GEMINI_API_KEY`.
- Frontend build-time: `NEXT_PUBLIC_API_URL=https://api.dev.rank.zobay.in/api/v1`.

## TLS

`api.dev.rank.zobay.in` terminates at Traefik (Let's Encrypt; currently valid to Dec 2026).
Renewal is automatic via Traefik ACME — keep its storage and challenge path healthy; add a
`certResolver` annotation to the Ingress only if this cluster requires it explicitly.

## Residual POC limitations

- GET detail/list reads are public; sub-resource writes are identity-bound, not per-object checked.
- `ENVIRONMENT` stays `development` so the dev-auth bootstrap exists — remove before anything production-like.
