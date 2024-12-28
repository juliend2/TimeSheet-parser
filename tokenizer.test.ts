import { expect, test } from "bun:test";
import Tokenizer from "./tokenizer"

test("tokenize line comments", () => {
    const tokenizer = new Tokenizer(
        `
        # comment
        `
    );
    tokenizer.tokenize()
    expect(tokenizer.tokens).toContain('# comment')
});

test("tokenize duration", () => {
    const tokenizer = new Tokenizer(`
        1:00 - 2:00
        `
    )
    tokenizer.tokenize()
    expect(tokenizer.tokens).toContain(`1:00 - 2:00`)
})

test("tokenize duration line with comment", () => {
    const tokenizer = new Tokenizer(`
        1:00 - 2:00 : ceci est une durée
        `
    )
    tokenizer.tokenize()
    expect(tokenizer.tokens).toContain(`1:00 - 2:00`)
    expect(tokenizer.tokens).toContain(`ceci est une durée`)
})

test("Don't tokenize invalid durations", () => {
    const tokenizer = new Tokenizer(`
        1x00 - 2p00
        `
    )
    tokenizer.tokenize()
    expect(tokenizer.tokens).toBeEmpty()

    // Half-good duration:
    const tokenizer2 = new Tokenizer(`
        1x00 - 2:00
        `
    )
    tokenizer2.tokenize()
    expect(tokenizer2.tokens).toBeEmpty()
})
