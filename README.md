<div align="center">
  <h1>🐱 CatMood</h1>
  <p><strong>AI-Powered Funny Cat Reaction Recommendation System</strong></p>
  <p><em>Developed by Yashwant Rangrej</em></p>
  <p>
    Detect facial emotions in real-time through your webcam and instantly get the funniest matching cat reactions.
  </p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-reference">API Reference</a>
  </p>
</div>

---

## ✨ Features

- **Real-Time Emotion Detection:** Analyzes facial expressions instantly using DeepFace & MediaPipe.
- **Smart Recommendations:** Recommends hand-picked funny cat images matching your current mood.
- **Save Favorites:** Easily favorite and manage your top cat reactions.
- **Modern UI/UX:** Clean, responsive, and beautiful interface built with Next.js 15 and Tailwind CSS.
- **Robust API:** Fast and reliable backend using FastAPI (Python).

## 🛠️ Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS |
| **Backend**  | FastAPI, Python 3.10+               |
| **AI/ML**    | DeepFace, MediaPipe                 |
| **Database** | SQLite, SQLAlchemy, Pydantic        |

## 🚀 Getting Started

Follow these steps to set up CatMood on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [Git](https://git-scm.com/)

### 1. Clone the repository
```bash
git clone <repo-url>
cd Memes_For_Fun
```

### 2. Backend Setup
Navigate to the `backend` directory and set up the Python environment:
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Start the FastAPI server (runs on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
Open a new terminal window, navigate to the `frontend` directory, and start the Next.js app:
```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the development server (runs on http://localhost:3000)
npm run dev
```

### 4. Dataset Configuration
To populate the app with your own cat images:
1. Place your raw cat images in a designated folder.
2. Run the classification script to organize them by emotion:
   ```bash
   cd backend
   python -m scripts.classify_images --source /path/to/your/cat/images
   ```
3. Seed the SQLite database with the classified images:
   ```bash
   python -m scripts.seed_database
   ```

## 📁 Project Structure

```text
Memes_For_Fun/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # Route endpoints
│   │   ├── core/             # Configuration & DB setup
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── services/         # Core business logic
│   ├── dataset/              # Classified cat images
│   └── scripts/              # Setup and seeding scripts
└── frontend/                 # Next.js Application
    ├── public/               # Static assets
    └── src/
        ├── app/              # App router pages
        ├── components/       # Reusable React components
        ├── hooks/            # Custom React hooks
        └── types/            # TypeScript definitions
```

## 🌐 API Reference

The backend API is documented automatically. Once running, visit `http://localhost:8000/docs` for the Swagger UI.

| Method | Endpoint                    | Description                           |
| ------ | --------------------------- | ------------------------------------- |
| POST   | `/api/v1/emotion/detect`    | Detects emotion from a provided image |
| GET    | `/api/v1/recommendations`   | Fetches cat image recommendations     |
| GET    | `/api/v1/favorites`         | Lists user's saved favorite images    |
| POST   | `/api/v1/favorites`         | Adds a new image to favorites         |
| DELETE | `/api/v1/favorites/{id}`    | Removes an image from favorites       |
| GET    | `/api/v1/health`            | Health check endpoint                 |

## 🎭 Supported Emotions

The system currently detects and categorizes the following facial expressions:
**😊 Happy** • **😢 Sad** • **😠 Angry** • **😨 Fear** • **😐 Neutral** • **😲 Surprise** • **🤢 Disgust**

## 📄 License

This project is created for educational and portfolio purposes. Please ensure you verify dataset licensing before any redistribution or commercial use.