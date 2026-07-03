"""Pydantic schemas for recommendation API."""

from pydantic import BaseModel


class ImageOut(BaseModel):
    """Schema for a single recommended image."""
    id: int
    filename: str
    emotion: str
    url: str

    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    """Response for recommendation endpoint."""
    emotion: str
    total: int
    images: list[ImageOut]
