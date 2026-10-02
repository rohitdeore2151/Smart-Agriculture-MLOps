# 🌱 Smart Agriculture MLOps

An end-to-end smart agriculture application that combines **Machine Learning, FastAPI, React, and MLOps practices** to provide data-driven agricultural predictions and recommendations.

## 🚀 Features

- 🌾 Crop Recommendation
- 🧪 Fertilizer Recommendation
- 💧 Irrigation Prediction
- 💰 Agricultural Price Prediction
- 🌱 Crop Yield Prediction
- 🌤️ Live Weather Information
- 🤖 Machine Learning model training and inference
- ⚡ FastAPI backend
- ⚛️ React + Vite frontend
- 🐳 Docker support
- 🔄 GitHub Actions workflows

## 🛠️ Tech Stack

### Machine Learning
- Python
- Scikit-learn
- Joblib
- Pandas
- NumPy

### Backend
- FastAPI
- Uvicorn
- Python

### Frontend
- React
- Vite
- JavaScript
- npm

### DevOps / MLOps
- Docker
- Docker Compose
- GitHub Actions
- Git & GitHub

### External API
- OpenWeatherMap API

## 📂 Project Structure

```text
Smart-Agriculture-MLOps/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── models/
│   │   ├── main.py
│   │   └── model_service.py
│   └── requirements.txt
│
├── data/
│
├── frontend/
│
├── ml/
│   ├── crop_recommendation/
│   ├── fertilizer/
│   ├── irrigation/
│   ├── price_prediction/
│   └── yield_prediction/
│
├── docker-compose.yml
├── package-lock.json
├── .gitignore
└── README.md