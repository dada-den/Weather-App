import { describe, it, expect } from "vitest";
import { describeWeather } from "./weatherCodes";

describe("Weather Codes", () => {
    it("describes a known code", () => {
        expect(describeWeather(0)).toBe("Clear sky");
    });

    it("describes the code from the real sample", () => {
        expect(describeWeather(61)).toBe("Slight rain");
    });

    it("returns a fallback for a code that is not in the table", () => {
        expect(describeWeather(999)).toBe("Unknown Condition");
    });
});