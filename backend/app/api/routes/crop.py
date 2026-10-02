from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...model_service import predict

router = APIRouter(prefix="/api/crop", tags=["crop"])


class CropRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@router.post("/recommend")
def recommend_crop(request: CropRequest) -> dict[str, Any]:
    try:
        result = predict("crop_recommendation_model.pkl", request.model_dump())
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    return {"prediction": result}
