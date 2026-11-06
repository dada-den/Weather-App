import type { AppState } from "./type";

function getElement(id: string): HTMLElement {
    const element = document.getElementById(id);

    if (element === null) {
        throw new Error(`Element not found: ${id}`);
    }

    return element;
}

export function render(state: AppState): void {
    const result = getElement("result");
    const button = getElement("search-btn") as HTMLButtonElement;

    button.disabled = state.kind === "loading";

    if (state.kind === "idle") {
        result.textContent = "";
    } else if (state.kind === "loading") {
        result.textContent = "Loading...";
    } else if (state.kind === "error") {
        result.innerHTML = "";
        const p = document.createElement("p");
        p.className = "error";
        p.textContent = state.message;
        result.appendChild(p);
    } else {
        const data = state.weatherData;
        result.innerHTML = "";

        const city = document.createElement("h2");
        city.textContent = data.cityName;

        const temperature = document.createElement("div");
        temperature.className = "temperature";
        temperature.textContent = `${data.temperature}℃`;

        const description = document.createElement("p");
        description.textContent = data.weatherDescription;

        const wind = document.createElement("div");
        wind.textContent = `Wind: ${data.windSpeed} km/h`;

        result.append(city, temperature, description, wind);
    }

}