"""Recommendation API route."""

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.recommend import RecommendationResponse
from app.services.recommend_service import get_recommendations, get_similar_images

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


@router.get(
    "/{image_id}/similar",
    response_model=RecommendationResponse,
    summary="Get similar images",
    description="Returns funny cat images similar to the specified image.",
)
async def get_similar_images_endpoint(
    image_id: int,
    limit: int = Query(5, ge=1, le=20, description="Maximum number of similar images to return"),
    db: Session = Depends(get_db),
):
    """Get cat image recommendations similar to a specific image."""
    images, target_emotion = get_similar_images(db, image_id, limit)
    
    if target_emotion is None:
        raise HTTPException(status_code=404, detail="Image not found")

    return RecommendationResponse(
        emotion=target_emotion,
        total=len(images),
        images=images,
    )
