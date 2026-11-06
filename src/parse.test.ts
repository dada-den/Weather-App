import { describe, it, expect } from "vitest";
import geocodingSample from "./samples/geocoding.json";
import geocodingEmptySample from "./samples/geocoding-empty.json";
import forecastSample from "./samples/forecast.json";
import { parseGeocoding, parseForecast } from "./parse";

describe("parseGeocoding", () => {
    it("reads name and cordinates from a valid response", () => {
        const result = parseGeocoding(geocodingSample);

        expect(result).toEqual({
            kind: "found",
            name: "Berlin",
            latitude: 52.52437,
            longitude: 13.41053
        });
    });

    it("returns not-found when the results key is missing", () => {
        const result = parseGeocoding(geocodingEmptySample);

        expect(result).toEqual({ kind: "not-found" });
    });

    it("returns not-found when results is an empty list", () => {
        const result = parseGeocoding({ results: [] });

        expect(result).toEqual({ kind: "not-found" });
    });

    it("returns invalid when the data is not an object", () => {
        const result = parseGeocoding("hello");

        expect(result).toEqual({ kind: "invalid" });
    });

    it("returns invalid when latitude type is string", () => {
        const result = parseGeocoding({ results: [{ name: "Berlin", latitude: "52.5", longitude: 13.4 }] });

        expect(result).toEqual({ kind: "invalid" });
    })
});


describe("parseForecast", () => {
    it("reads temperature, weather code, and wind speed from a valid response", () => {
        const result = parseForecast(forecastSample);

        expect(result).toEqual({
            kind: "found",
            temperature: 8.7,
            weatherCode: 61,
            windSpeed: 5.6    
        });
    });

    it("returns invalid when the current key is missing", () => {
        const result = parseForecast({ latitude: 52.5 });

        expect(result).toEqual({ kind: "invalid" });
    });

    it("returns invalid when the temperature is not a number", () => {
        const result = parseForecast({
            current: {  temperature_2m: "8.7", weather_code: 61, wind_speed_10m: 5.6 }
        });

        expect(result).toEqual({ kind: "invalid" });
    });
});