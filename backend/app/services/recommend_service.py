"""Recommendation service for cat images."""

import logging
import random

from sqlalchemy.orm import Session

from app.models.image import Image

logger = logging.getLogger(__name__)

# Number of images to recommend per request
RECOMMENDATION_COUNT = 5


def get_recommendations(
    db: Session,
    emotion: str,
    exclude_ids: list[int] | None = None,
) -> list[dict]:
    """Get cat image recommendations based on detected emotion.

    Args:
        db: Database session.
        emotion: The detected emotion to match.
        exclude_ids: Optional list of image IDs to exclude (for refresh).

    Returns:
        List of image dictionaries with id, filename, emotion, and url.
    """
    query = db.query(Image).filter(Image.emotion == emotion)

    if exclude_ids:
        query = query.filter(Image.id.notin_(exclude_ids))

    all_images = query.all()

    # If not enough images for the emotion, fall back to neutral
    if len(all_images) < RECOMMENDATION_COUNT:
        logger.info(
            f"Only {len(all_images)} images for '{emotion}'. "
            f"Supplementing with neutral images."
        )
        remaining = RECOMMENDATION_COUNT - len(all_images)
        neutral_query = db.query(Image).filter(Image.emotion == "neutral")
        if exclude_ids:
            neutral_query = neutral_query.filter(Image.id.notin_(exclude_ids))
        neutral_images = neutral_query.all()
        all_images.extend(neutral_images[:remaining])

    # Shuffle for variety
    random.shuffle(all_images)

    # Take top N
    selected = all_images[:RECOMMENDATION_COUNT]

    return [
        {
            "id": img.id,
            "filename": img.filename,
            "emotion": img.emotion,
            "url": f"/dataset/images/{img.emotion}/{img.filename}",
        }
        for img in selected
    ]
