"""Favorites service for managing saved cat images."""

import logging

from sqlalchemy.orm import Session

from app.models.favorite import Favorite
from app.models.image import Image

logger = logging.getLogger(__name__)


def get_favorites(db: Session) -> list[dict]:
    """Retrieve all saved favorites.

    Args:
        db: Database session.

    Returns:
        List of favorite dictionaries.
    """
    favorites = (
        db.query(Favorite)
        .join(Image, Favorite.image_id == Image.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )

    return [
        {
            "id": fav.id,
            "image_id": fav.image_id,
            "filename": fav.image.filename,
            "emotion": fav.image.emotion,
            "url": f"/dataset/images/{fav.image.emotion}/{fav.image.filename}",
            "created_at": fav.created_at,
        }
        for fav in favorites
    ]


def add_favorite(db: Session, image_id: int) -> dict:
    """Save an image as a favorite.

    Args:
        db: Database session.
        image_id: ID of the image to favorite.

    Returns:
        Result dictionary with success status.
    """
    # Check if image exists
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        return {"success": False, "message": "Image not found."}

    # Check for duplicates
    existing = (
        db.query(Favorite).filter(Favorite.image_id == image_id).first()
    )
    if existing:
        return {"success": False, "message": "Image already in favorites."}

    favorite = Favorite(image_id=image_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)

    logger.info(f"Added favorite: image_id={image_id}")
    return {"success": True, "id": favorite.id}


def remove_favorite(db: Session, favorite_id: int) -> dict:
    """Remove an image from favorites.

    Args:
        db: Database session.
        favorite_id: ID of the favorite entry to remove.

    Returns:
        Result dictionary with success status.
    """
    favorite = db.query(Favorite).filter(Favorite.id == favorite_id).first()
    if not favorite:
        return {"success": False, "message": "Favorite not found."}

    db.delete(favorite)
    db.commit()

    logger.info(f"Removed favorite: id={favorite_id}")
    return {"success": True}
