import "./style.css";
import type { AppState } from "./type";
import { fetchWeather } from "./api";
import { render } from "./render";

let state: AppState = { kind: "idle" };

function update(newState: AppState): void {
    state = newState;
    render(state);
}

const form = document.getElementById("search-form");
const input = document.getElementById("city-input") as HTMLInputElement;

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = input?.value.trim() ?? "";

    if (city === "") {
        update({ kind: "error", message: "Please enter a city name" });
        return;
    }

    update({ kind: "loading" });
    update(await fetchWeather(city));
})

render(state);
