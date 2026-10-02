# Smart Agriculture MLOps

An AI-powered agriculture application with a FastAPI backend, React frontend, and machine-learning models for crop, fertilizer, irrigation, price, and yield predictions.

## Project structure

```text
backend/
  app/
    main.py                 FastAPI application
    model_service.py        Shared model loading and prediction logic
    api/routes/             Prediction and weather endpoints
    models/                 Trained Joblib model artifacts
  requirements.txt
ml/
  crop_recommendation/
  fertilizer/
  irrigation/
  price_prediction/
  yield_prediction/
data/                       Training datasets
frontend/                   React/Vite application
```

## Requirements

- Python 3.11+
- Node.js and npm
- An OpenWeatherMap API key for live weather data

## Backend setup

From the project root:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

Create `backend\.env`:

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
WEATHER_CITY=Hyderabad
```

Never commit `backend\.env` or expose the API key in frontend code. The repository ignores this file.

Start the API from the project root:

```powershell
uvicorn backend.app.main:app --reload
```

The API runs at <http://127.0.0.1:8000>. Interactive documentation is available at <http://127.0.0.1:8000/docs>.

### Backend verification

```powershell
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/api/weather
```

If weather returns `503`, ensure `backend\.env` exists and restart Uvicorn. If it returns a provider key error, verify that the OpenWeatherMap key is active.

## Frontend setup

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at <http://localhost:5173> and calls the backend at `http://localhost:8000` by default. To use another API URL, create `frontend\.env`:

```env
VITE_API_URL=http://localhost:8000
```

Create a production build with:

```powershell
npm run build
```

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | API health check |
| POST | `/api/crop/recommend` | Recommend a crop |
| POST | `/api/fertilizer/predict` | Predict fertilizer recommendation |
| POST | `/api/irrigation/predict` | Predict irrigation need |
| POST | `/api/price/predict` | Predict commodity price |
| POST | `/api/yield/predict` | Predict crop yield |
| GET | `/api/weather` | Current weather and five-day forecast |

Open `/docs` to view the required request schemas and test endpoints.

## Training models

Each training script reads its dataset from `data/` and saves a Joblib artifact to `backend/app/models/`.

```powershell
python ml\crop_recommendation\train.py
python ml\fertilizer\train.py
python ml\irrigation\train.py
python ml\price_prediction\train.py
python ml\yield_prediction\train.py
```

Run training again whenever the source datasets or preprocessing logic changes.

## Security notes

- Keep API keys in environment files, never in source code.
- Do not commit `backend\.env`.
- The backend proxies OpenWeatherMap requests so the key is not sent to browsers.