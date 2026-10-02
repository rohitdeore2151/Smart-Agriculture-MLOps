from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...model_service import predict

router = APIRouter(prefix="/api/price", tags=["price"])


class PriceRequest(BaseModel):
    month: str
    commodity_name: str
    state_name: str
    district_name: str
    avg_min_price: float
    avg_max_price: float
    change: float


@router.post("/predict")
def predict_price(request: PriceRequest) -> dict[str, Any]:
    try:
        result = predict("price_prediction_model.pkl", request.model_dump())
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    return {"prediction": result}
