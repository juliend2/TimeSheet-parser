import { expect, test } from "bun:test";
import Hour from "../src/hour"
import Duration, { PositiveNumber } from "../src/duration"

test("calculate time difference", () => {
    const from = new Hour('1:30')
    const to = new Hour('2:30')
    const duration = new Duration(from, to)
    expect(duration.inMinutes()).toBe(60 as PositiveNumber)
});

test("disallow negative numbers", () => {
    const from = new Hour('1:30')
    const to = new Hour('1:29')
    const duration = new Duration(from, to)
    expect(() => { duration.inMinutes() }).toThrow(Error)
})