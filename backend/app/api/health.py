"""Health check API route."""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    summary="Health check",
    description="Returns the current status of the API.",
)
async def health_check():
    """Simple health check endpoint."""
    return {"status": "running"}
