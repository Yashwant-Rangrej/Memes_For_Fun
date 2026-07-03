"""Pydantic schemas for favorites API."""

from datetime import datetime
from pydantic import BaseModel


class FavoriteCreate(BaseModel):
    """Request body to add a favorite."""
    image_id: int


class FavoriteOut(BaseModel):
    """Response schema for a favorite entry."""
    id: int
    image_id: int
    filename: str
    emotion: str
    url: str
    created_at: datetime

    class Config:
        from_attributes = True


class FavoriteListResponse(BaseModel):
    """Response for listing favorites."""
    total: int
    favorites: list[FavoriteOut]
