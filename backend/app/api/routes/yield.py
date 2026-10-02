from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...model_service import predict

router = APIRouter(prefix="/api/yield", tags=["yield"])


class YieldRequest(BaseModel):
    Crop_Type: str
    Field_Size_hectares: float
    Planting_Date: str
    Soil_Type: str
    Fertilizer_Used: str
    Irrigation_Type: str


@router.post("/predict")
def predict_yield(request: YieldRequest) -> dict[str, Any]:
    values = request.model_dump()
    values = {
        "Crop Type": values["Crop_Type"],
        "Field Size (hectares)": values["Field_Size_hectares"],
        "Planting Date": values["Planting_Date"],
        "Soil Type": values["Soil_Type"],
        "Fertilizer Used": values["Fertilizer_Used"],
        "Irrigation Type": values["Irrigation_Type"],
    }
    try:
        result = predict("random_forest_model.pkl", values)
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    return {"prediction": result}
