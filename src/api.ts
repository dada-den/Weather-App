import { describeWeather } from "./weatherCodes";
import { parseGeocoding, parseForecast } from "./parse";
import type { AppState, GeocodeResult, ForecastResult } from "./type";

export async function fetchGeocoding(city: string): Promise<unknown> {
    const url = 
        "https://geocoding-api.open-meteo.com/v1/search?name=" + 
        encodeURIComponent(city) +
        "&count=1";

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Geocoding request failed");
    }

    const data: unknown = response.json();
    return data;
}

export async function getCoordinates(city: string): Promise<GeocodeResult | { kind: "network-error" }> {
    try {
        const data = await fetchGeocoding(city);
        return parseGeocoding(data);
    } catch {
        return { kind: "network-error" }
    }

}


export async function fetchForecast(latitude: number, longitude: number): Promise<unknown> {
    const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        "&current=temperature_2m,weather_code,wind_speed_10m";

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Forecast request failed");
    }

    const data: unknown = await response.json();
    return data;
}

export async function getForecast(latitude: number, longitude: number): Promise<ForecastResult | { kind: "network-error" }> {
    try {
        const data = await fetchForecast(latitude, longitude);
        return parseForecast(data);
    } catch {
        return { kind: "network-error" };
    }
}

export async function fetchWeather(city: string): Promise<AppState> {
    const geo = await getCoordinates(city);

    if (geo.kind === "network-error") {
        return { kind: "error", message: "Could not reach the weather service" };
    }
    if (geo.kind === "not-found") {
        return { kind: "error", message: "City not found" };
    }
    if (geo.kind === "invalid") {
        return { kind: "error", message: "Recieved unexpected data from the weather service" };
    }

    const forecast = await getForecast(geo.latitude, geo.longitude);

    if (forecast.kind === "network-error") {
        return { kind: "error", message: "Could not reach the weather service" };
    }
    if (forecast.kind === "invalid") {
        return { kind: "error", message: "Recieved unexpected data from the weather service" };
    }

    return {
        kind: "success",
        weatherData: {
            cityName: geo.name,
            temperature: forecast.temperature,
            weatherDescription: describeWeather(forecast.weatherCode),
            windSpeed: forecast.windSpeed
        }
    };
}