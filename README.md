# 🐱 CatMood

**AI-Powered Funny Cat Reaction Recommendation System**

> Detect facial emotions in real-time through a webcam and instantly recommend the funniest cat reaction images.

---

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | Next.js 15, TypeScript, Tailwind CSS |
| Backend   | FastAPI (Python)                    |
| AI        | DeepFace, MediaPipe                 |
| Database  | SQLite                              |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone <repo-url>
cd Memes_For_Fun
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 4. Dataset Setup

1. Place your cat images in a folder (e.g., `raw_cats/`)
2. Classify them into emotion categories:

```bash
cd backend
python -m scripts.classify_images --source /path/to/your/cat/images
```

3. Seed the database:

```bash
python -m scripts.seed_database
```

---

## Project Structure

```
Memes_For_Fun/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routes
│   │   ├── core/         # Config, database
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── dataset/          # Cat images (by emotion)
│   ├── scripts/          # Setup scripts
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API client
│   │   └── types/        # TypeScript types
│   └── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | `/api/v1/emotion/detect` | Detect emotion from image |
| GET    | `/api/v1/recommendations` | Get cat image recs       |
| GET    | `/api/v1/favorites`      | List favorites           |
| POST   | `/api/v1/favorites`      | Add favorite             |
| DELETE | `/api/v1/favorites/{id}` | Remove favorite          |
| GET    | `/api/v1/health`         | Health check             |

---

## Supported Emotions

😊 Happy · 😢 Sad · 😠 Angry · 😨 Fear · 😐 Neutral · 😲 Surprise · 🤢 Disgust

---

## License

Educational and portfolio purposes. Verify dataset licensing before redistribution.