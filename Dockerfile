# ==========================================
# DMOS SEO & AEO Platform — Production Image
# Multi-stage optimized Python 3.11 container
# ==========================================

FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into wheels/cache
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --user -r requirements.txt

# ==========================================
# Final Runtime Stage
# ==========================================
FROM python:3.11-slim AS runner

WORKDIR /app

# Python runtime optimization flags
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/backend \
    PORT=8000 \
    PATH=/home/appuser/.local/bin:$PATH

# Install minimal runtime libraries (curl for healthcheck, libpq for PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -u 1001 -s /bin/bash appuser

# Copy installed Python packages from builder stage with correct ownership
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Copy backend application source code
COPY --chown=appuser:appuser backend/ ./backend/

# Create data directory and ensure appuser has write permissions across /app and /home/appuser
RUN mkdir -p /app/data && chown -R appuser:appuser /app /home/appuser

# Switch to non-root secure user
USER appuser

# Expose default HTTP port
EXPOSE 8000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Launch FastAPI ASGI server
CMD ["sh", "-c", "uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port ${PORT:-8000} --workers 2"]
