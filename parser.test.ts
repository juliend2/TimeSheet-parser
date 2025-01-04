import Tokenizer, { Duration, Comment, Token } from './tokenizer'
import Parser from './parser'
import { expect, test } from 'bun:test'


class MockTokenizer extends Tokenizer {
    protected _timesheet: string;
    protected _tokens: Token[] = []

    constructor() {
        super('')
        this._timesheet = ''
    }

    public forceTokens(tokens: Token[]) {
        this._tokens = tokens
    }

    public tokenize() {
        // NOOP
    }

    public get tokens(): Token[] {
        return this._tokens
    }
}

test('parse a timesheet', () => {
    const timesheet = `
    # comment

    1h00 - 2h00
    2h00 - 3h00
    `

    const tokenizer = new Tokenizer(timesheet)
    const parser = new Parser(tokenizer)

    parser.groupByComments()
    for (const tok of parser.tokens) {

        // console.log('token', tok)
    }
    expect(parser.tokens).toContainEqual({ text: '1h00 - 2h00', type: 'duration' })
})

test('groups the durations with the comments', () => {
    const tokenizer = new MockTokenizer()
    tokenizer.forceTokens([
        new Comment('project 1'),
        new Duration('1:00 - 2:00'),
        new Duration('2:00 - 3:00'),
        new Comment('project 2'),
        new Duration('3:00 - 3:30'),
        new Duration('3:33 - 4:00'),
    ])

    const parser = new Parser(tokenizer)
    parser.groupByComments()
    console.log('bob', parser.totals)
    expect(parser.totals).toBeArray()
    expect(parser.totals).toHaveLength(2)
})