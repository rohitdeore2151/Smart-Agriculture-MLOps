from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...model_service import predict

router = APIRouter(prefix="/api/fertilizer", tags=["fertilizer"])


class FertilizerRequest(BaseModel):
    Soil_Type: str
    Soil_pH: float
    Soil_Moisture: float
    Organic_Carbon: float
    Nitrogen_Level: float
    Phosphorus_Level: float
    Potassium_Level: float
    Crop_Type: str
    Crop_Growth_Stage: str
    Season: str


@router.post("/predict")
def predict_fertilizer(request: FertilizerRequest) -> dict[str, Any]:
    try:
        result = predict("fertilizer_model.pkl", request.model_dump())
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    return {"prediction": result}
