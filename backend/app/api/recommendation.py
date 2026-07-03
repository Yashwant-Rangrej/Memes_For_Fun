"""Recommendation API route."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.recommend import RecommendationResponse
from app.services.recommend_service import get_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get(
    "",
    response_model=RecommendationResponse,
    summary="Get cat image recommendations",
    description="Returns 5 funny cat images matching the specified emotion.",
)
async def get_recommendations_endpoint(
    emotion: str = Query(..., description="The detected emotion to match"),
    exclude: str = Query("", description="Comma-separated IDs to exclude"),
    db: Session = Depends(get_db),
):
    """Get cat image recommendations based on the detected emotion.

    Pass the emotion from the detection endpoint. Optionally exclude
    image IDs from previous recommendations (for refresh functionality).
    """
    exclude_ids = []
    if exclude:
        try:
            exclude_ids = [int(x) for x in exclude.split(",") if x.strip()]
        except ValueError:
            exclude_ids = []

    images = get_recommendations(db, emotion, exclude_ids)

    return RecommendationResponse(
        emotion=emotion,
        total=len(images),
        images=images,
    )
