from fastapi import APIRouter

from services.container import app_container

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    return app_container.health_snapshot()

