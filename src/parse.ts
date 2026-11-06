import type { GeocodeResult, ForecastResult } from "./type";

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function parseGeocoding(data: unknown): GeocodeResult {
    if (!isObject(data)) {
        return { kind: "invalid" };
    }

    if (!("results" in data)) {
        return { kind: "not-found" };
    }

    const results: unknown = data.results

    if (!Array.isArray(results)) {
        return { kind: "invalid" }
    }

    if (results.length === 0) {
        return { kind: "not-found" };
    }

    const first = results[0];

    if (typeof first !== "object" || first === null) {
        return { kind: "invalid"};
    }

    if (
        !("name" in first) ||
        !("latitude" in first) ||
        !("longitude" in first)
    ) {
        return { kind: "invalid" };
    }

    if (
        typeof first.name !== "string" ||
        typeof first.latitude !== "number" ||
        typeof first.longitude !== "number"
    ) {
        return { kind: "invalid" }
    }

    return {
        kind: "found",
        name: first.name,
        latitude: first.latitude,
        longitude: first.longitude
    }
}


export function parseForecast(data: unknown): ForecastResult {
    if (!isObject(data)) {
        return { kind: "invalid" };
    }

    if (!("current" in data)) {
        return { kind: "invalid" };
    }

    const current: unknown = data.current;

    if (!isObject(current)) {
        return { kind: "invalid" }
    }

    if (
        !("temperature_2m" in current) ||
        !("weather_code" in current) ||
        !("wind_speed_10m" in current)
    ) {
        return { kind: "invalid" }
    }

    if (
        typeof current.temperature_2m !== "number" ||
        typeof current.weather_code !== "number" ||
        typeof current.wind_speed_10m !== "number"
    ) {
        return { kind: "invalid" }
    }

    return {
        kind: "found",
        temperature: current.temperature_2m,
        weatherCode: current.weather_code,
        windSpeed: current.wind_speed_10m
    }
}