import clipboard from 'clipboardy';

// console.log(clipboard.readSync())

import { expect, test } from "bun:test";

test("addition works correctly", () => {
  expect(1 + 1).toBe(2);
});

test("string contains substring", () => {
  expect("Hello, world!").toContain("world");
});


