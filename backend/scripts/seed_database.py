"""Seed the database from metadata.json.

Reads the classified image metadata and populates the SQLite database.

Usage:
    cd backend
    python -m scripts.seed_database
"""

import json
import logging
import sys
from pathlib import Path

# Add the backend directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal, init_db
from app.models.image import Image

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def seed_database():
    """Populate the database from metadata.json."""
    metadata_path = Path(__file__).parent.parent / "dataset" / "metadata.json"

    if not metadata_path.exists():
        logger.error(f"metadata.json not found at: {metadata_path}")
        logger.error("Run classify_images.py first to generate metadata.")
        return

    with open(metadata_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    logger.info(f"Loaded {len(metadata)} image entries from metadata.json")

    # Initialize database tables
    init_db()

    db = SessionLocal()
    try:
        # Check if already seeded
        existing_count = db.query(Image).count()
        if existing_count > 0:
            logger.info(f"Database already contains {existing_count} images.")
            response = input("Clear and re-seed? (y/N): ").strip().lower()
            if response != "y":
                logger.info("Aborted.")
                return
            db.query(Image).delete()
            db.commit()
            logger.info("Cleared existing images.")

        # Insert all images
        for item in metadata:
            image = Image(
                filename=item["filename"],
                emotion=item["emotion"],
                category=item.get("category", "reaction"),
                tags=json.dumps(item.get("tags", [])),
                width=item.get("width", 0),
                height=item.get("height", 0),
                format=item.get("format", "jpg"),
            )
            db.add(image)

        db.commit()
        logger.info(f"Successfully seeded {len(metadata)} images into database.")

        # Print distribution
        from sqlalchemy import func
        results = (
            db.query(Image.emotion, func.count(Image.id))
            .group_by(Image.emotion)
            .all()
        )
        logger.info("\nDatabase distribution:")
        for emotion, count in sorted(results):
            logger.info(f"  {emotion:>10}: {count:>4} images")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
