from functools import lru_cache
import logging
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from fastapi import HTTPException


MODEL_DIR = Path(__file__).resolve().parent / "models"
logger = logging.getLogger(__name__)


@lru_cache(maxsize=None)
def load_model(model_name: str) -> Any:
    model_path = MODEL_DIR / model_name
    if not model_path.is_file():
        raise FileNotFoundError(f"Model artifact not found: {model_path}")
    try:
        return joblib.load(model_path)
    except ImportError as error:
        logger.exception("Could not load model %s", model_name)
        raise HTTPException(
            status_code=503,
            detail=(
                "A required model dependency could not be loaded. Check the backend log; "
                "Windows Application Control may have blocked a native module."
            ),
        ) from error


def predict(model_name: str, values: dict[str, Any]) -> Any:
    model = load_model(model_name)
    features = dict(values)

    if model_name == "random_forest_model.pkl":
        date = pd.to_datetime(features.pop("Planting Date"), errors="raise")
        features.update(
            {
                "Planting_Year": date.year,
                "Planting_Month": date.month,
                "Planting_Day": date.day,
                "Planting_DayOfYear": date.dayofyear,
                "Planting_Quarter": date.quarter,
            }
        )
    elif model_name == "price_prediction_model.pkl":
        features["month"] = pd.to_datetime(features["month"], errors="raise").month

    expected_columns = getattr(model, "feature_names_in_", None)
    if expected_columns is not None:
        features = {column: features.get(column) for column in expected_columns}

    result = model.predict(pd.DataFrame([features]))[0]
    return result.item() if hasattr(result, "item") else result
