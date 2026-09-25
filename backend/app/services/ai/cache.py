import hashlib
import json
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger("zobayrank.ai.cache")

# Fast thread-safe in-memory cache fallback (also works without Redis)
_MEMORY_CACHE: Dict[str, Dict[str, Any]] = {}


class AICacheService:
    """
    Deterministic caching layer for expensive LLM calls.
    Computes a SHA-256 fingerprint from:
      project_id + content_hash + analysis_type + prompt_version + model_name
    """

    CURRENT_PROMPT_VERSION = "v1.2.0"

    @classmethod
    def compute_cache_key(
        cls,
        project_id: str,
        content: str,
        analysis_type: str,
        model_name: str,
        prompt_version: Optional[str] = None,
    ) -> str:
        pv = prompt_version or cls.CURRENT_PROMPT_VERSION
        content_hash = hashlib.sha256(content.strip().encode("utf-8")).hexdigest()[:16]
        raw_key = f"{project_id}:{content_hash}:{analysis_type}:{pv}:{model_name}"
        return f"ai_cache:{hashlib.sha256(raw_key.encode('utf-8')).hexdigest()}"

    @classmethod
    def get(cls, cache_key: str) -> Optional[Dict[str, Any]]:
        cached = _MEMORY_CACHE.get(cache_key)
        if cached:
            logger.debug(f"[AICache] Cache hit for key {cache_key}")
            return cached
        return None

    @classmethod
    def set(cls, cache_key: str, data: Dict[str, Any]) -> None:
        # Enforce memory cache limit (e.g. max 5000 entries)
        if len(_MEMORY_CACHE) > 5000:
            # Purge 1000 oldest keys
            keys_to_remove = list(_MEMORY_CACHE.keys())[:1000]
            for k in keys_to_remove:
                _MEMORY_CACHE.pop(k, None)
        _MEMORY_CACHE[cache_key] = data
        logger.debug(f"[AICache] Cached response for key {cache_key}")

    @classmethod
    def invalidate(cls, cache_key: str) -> None:
        _MEMORY_CACHE.pop(cache_key, None)

    @classmethod
    def clear_project(cls, project_id: str) -> None:
        # Clear entries containing project prefix
        keys_to_del = [k for k in _MEMORY_CACHE if project_id in k]
        for k in keys_to_del:
            _MEMORY_CACHE.pop(k, None)
