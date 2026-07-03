"""Favorites API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.favorite import FavoriteCreate, FavoriteListResponse
from app.services.favorite_service import add_favorite, get_favorites, remove_favorite

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get(
    "",
    response_model=FavoriteListResponse,
    summary="List all favorites",
)
async def list_favorites(db: Session = Depends(get_db)):
    """Retrieve all saved favorite cat images."""
    favorites = get_favorites(db)
    return FavoriteListResponse(total=len(favorites), favorites=favorites)


@router.post(
    "",
    summary="Add a favorite",
)
async def create_favorite(body: FavoriteCreate, db: Session = Depends(get_db)):
    """Save a cat image to favorites."""
    result = add_favorite(db, body.image_id)
    return result


@router.delete(
    "/{favorite_id}",
    summary="Remove a favorite",
)
async def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    """Remove a cat image from favorites."""
    result = remove_favorite(db, favorite_id)
    return result
