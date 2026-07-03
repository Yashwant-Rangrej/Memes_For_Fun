"""Pydantic schemas for emotion detection."""

from pydantic import BaseModel


class EmotionRequest(BaseModel):
    """Request body for emotion detection endpoint."""
    image: str  # base64 encoded image


class EmotionResponse(BaseModel):
    """Response for successful emotion detection."""
    success: bool = True
    emotion: str
    confidence: float
    all_emotions: dict[str, float]


class EmotionErrorResponse(BaseModel):
    """Response for failed emotion detection."""
    success: bool = False
    message: str
