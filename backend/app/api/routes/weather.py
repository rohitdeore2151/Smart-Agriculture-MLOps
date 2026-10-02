import json
import os
from datetime import datetime
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from fastapi import APIRouter, HTTPException, Query

from ... import config  # noqa: F401

router = APIRouter(prefix="/api/weather", tags=["weather"])
OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5"
OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"


def _request(endpoint: str, params: dict[str, str]) -> dict:
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Weather service is not configured. Set OPENWEATHER_API_KEY.",
        )

    query = urlencode({**params, "appid": api_key, "units": "metric"})
    try:
        with urlopen(f"{OPENWEATHER_URL}/{endpoint}?{query}", timeout=10) as response:
            return json.load(response)
    except HTTPError as error:
        if error.code == 401:
            raise HTTPException(
                status_code=502,
                detail="Weather provider rejected the API key. Check that the key is active and valid.",
            ) from error
        if error.code == 404:
            raise HTTPException(
                status_code=502,
                detail="Weather provider could not find the configured city.",
            ) from error
        raise HTTPException(status_code=502, detail="Weather provider request failed.") from error
    except (URLError, TimeoutError) as error:
        raise HTTPException(status_code=502, detail="Weather provider is unavailable.") from error


def _location_params(city: str | None, latitude: float | None, longitude: float | None) -> dict[str, str]:
    if latitude is not None and longitude is not None:
        return {"lat": str(latitude), "lon": str(longitude)}
    return {"q": city or os.getenv("WEATHER_CITY", "Delhi")}


def _open_meteo_request(url: str, params: dict[str, str]) -> dict:
    query = urlencode(params)
    try:
        with urlopen(f"{url}?{query}", timeout=10) as response:
            return json.load(response)
    except HTTPError as error:
        raise HTTPException(status_code=502, detail="Weather provider request failed.") from error
    except (URLError, TimeoutError) as error:
        raise HTTPException(status_code=502, detail="Weather provider is unavailable.") from error


def _weather_description(code: int) -> str:
    if code == 0:
        return "Clear sky"
    if code in (1, 2, 3):
        return "Partly cloudy"
    if code in (45, 48):
        return "Fog"
    if 51 <= code <= 57:
        return "Drizzle"
    if 61 <= code <= 67 or 80 <= code <= 82:
        return "Rain"
    if 71 <= code <= 77 or code in (85, 86):
        return "Snow"
    if code >= 95:
        return "Thunderstorm"
    return "Cloudy"


def _get_weather_from_open_meteo(
    city: str | None,
    latitude: float | None,
    longitude: float | None,
) -> dict:
    if latitude is not None and longitude is not None:
        location = {"name": city or "Configured location", "country": "", "latitude": latitude, "longitude": longitude}
    else:
        location_name = city or os.getenv("WEATHER_CITY", "Delhi")
        geocoding = _open_meteo_request(
            OPEN_METEO_GEOCODING_URL,
            {"name": location_name, "count": "1", "language": "en", "format": "json"},
        )
        results = geocoding.get("results", [])
        if not results:
            raise HTTPException(status_code=404, detail="Weather provider could not find the configured city.")
        location = results[0]

    forecast = _open_meteo_request(
        OPEN_METEO_FORECAST_URL,
        {
            "latitude": str(location["latitude"]),
            "longitude": str(location["longitude"]),
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
            "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
            "forecast_days": "5",
            "timezone": "auto",
            "wind_speed_unit": "kmh",
        },
    )
    current = forecast["current"]
    daily = forecast["daily"]
    days = [
        {
            "date": date,
            "high": round(high),
            "low": round(low),
            "rain_probability": rain_probability or 0,
            "description": _weather_description(code),
        }
        for date, high, low, rain_probability, code in zip(
            daily["time"],
            daily["temperature_2m_max"],
            daily["temperature_2m_min"],
            daily["precipitation_probability_max"],
            daily["weather_code"],
        )
    ]

    return {
        "location": location.get("name", "Configured location"),
        "country": location.get("country", ""),
        "provider": "Open-Meteo",
        "current": {
            "temperature": round(current["temperature_2m"]),
            "feels_like": round(current["apparent_temperature"]),
            "description": _weather_description(current["weather_code"]),
            "humidity": current["relative_humidity_2m"],
            "wind_speed": round(current["wind_speed_10m"], 1),
            "rain_probability": days[0]["rain_probability"] if days else 0,
        },
        "forecast": days,
    }


@router.get("")
def get_weather(
    city: str | None = Query(default=None),
    latitude: float | None = Query(default=None),
    longitude: float | None = Query(default=None),
) -> dict:
    if not os.getenv("OPENWEATHER_API_KEY"):
        return _get_weather_from_open_meteo(city, latitude, longitude)

    params = _location_params(city, latitude, longitude)
    current = _request("weather", params)
    forecast = _request("forecast", params)
    daily: dict[str, dict] = {}

    for item in forecast["list"]:
        date = datetime.fromtimestamp(item["dt"]).date().isoformat()
        entry = daily.setdefault(
            date,
            {
                "date": date,
                "temperatures": [],
                "rain_probability": 0,
                "description": item["weather"][0]["description"].title(),
                "icon": item["weather"][0]["icon"],
            },
        )
        entry["temperatures"].append(item["main"]["temp"])
        entry["rain_probability"] = max(entry["rain_probability"], round(item.get("pop", 0) * 100))

    days = list(daily.values())[:5]
    for entry in days:
        entry["high"] = round(max(entry.pop("temperatures")))
        entry["low"] = round(min(entry.pop("temperatures")))

    return {
        "location": current.get("name", "Configured location"),
        "country": current.get("sys", {}).get("country", ""),
        "provider": "OpenWeatherMap",
        "current": {
            "temperature": round(current["main"]["temp"]),
            "feels_like": round(current["main"]["feels_like"]),
            "description": current["weather"][0]["description"].title(),
            "icon": current["weather"][0]["icon"],
            "humidity": current["main"]["humidity"],
            "wind_speed": round(current["wind"].get("speed", 0) * 3.6, 1),
            "rain_probability": days[0]["rain_probability"] if days else 0,
        },
        "forecast": days,
    }
