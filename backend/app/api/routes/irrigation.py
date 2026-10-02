from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...model_service import predict

router = APIRouter(prefix="/api/irrigation", tags=["irrigation"])


class IrrigationRequest(BaseModel):
    Soil_Type: str
    Soil_pH: float
    Soil_Moisture: float
    Temperature_C: float
    Humidity: float
    Rainfall_mm: float
    Sunlight_Hours: float
    Crop_Type: str
    Crop_Growth_Stage: str
    Field_Area_hectare: float


@router.post("/predict")
def predict_irrigation(request: IrrigationRequest) -> dict[str, Any]:
    try:
        result = predict("irrigation_model.pkl", request.model_dump())
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    return {"prediction": result}
