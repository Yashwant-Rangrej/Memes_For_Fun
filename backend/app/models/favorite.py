"""Favorite database model."""

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.core.database import Base


class Favorite(Base):
    """Represents a user's favorite cat reaction image."""

    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    image_id = Column(Integer, ForeignKey("images.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    image = relationship("Image", lazy="joined")

    def __repr__(self) -> str:
        return f"<Favorite(id={self.id}, image_id={self.image_id})>"
