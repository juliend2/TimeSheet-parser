import { expect, test } from "bun:test";

import Hour from "../src/hour"

test("calculates minutes", () => {
    const h = new Hour('1:30')
    expect(h.toMinutes()).toBe(90)
});

test("midnight is supported", () => {
    const h = new Hour('00:30')
    expect(h.toMinutes()).toBe(30)
});

