export type WeatherData = {
    cityName: string;
    temperature: number;
    weatherDescription: string;
    windSpeed: number;
};

export type AppState = 
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "success"; weatherData: WeatherData }
    | { kind: "error"; message: string };

export type GeocodeResult = 
    | { kind: "found"; name: string; latitude: number; longitude: number }
    | { kind: "not-found" }
    | { kind: "invalid" };

export type ForecastResult = 
    | { kind: "found"; temperature: number; weatherCode: number; windSpeed: number }
    | { kind: "invalid" }

