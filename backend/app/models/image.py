"""Image database model."""

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from app.core.database import Base


class Image(Base):
    """Represents a cat reaction image in the dataset."""

    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String, nullable=False)
    emotion = Column(String, nullable=False, index=True)
    category = Column(String, default="reaction")
    tags = Column(String, default="[]")  # JSON string of tags
    width = Column(Integer, default=0)
    height = Column(Integer, default=0)
    format = Column(String, default="jpg")
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<Image(id={self.id}, filename='{self.filename}', emotion='{self.emotion}')>"
