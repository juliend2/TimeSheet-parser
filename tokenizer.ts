import { z } from 'zod'

const HourToken = z.string().regex(/^\d{1,2}[h:]\d{2}$/)
export type HourToken = z.infer<typeof HourToken>

export type DurationComment = string

const DurationToken = z.string().refine((str) => {
    let [from, to] = str.split(/ - /, 2)
    if (!from || !to) {
        return false
    }
    if (/ : /.test(to)) {
        to = to.split(/ : /, 2)[0]
    }
    if (HourToken.safeParse(from).error || HourToken.safeParse(to).error) {
        return false
    }
    return true
})
export type DurationToken = z.infer<typeof DurationToken>

const DurationLine = z.string().refine((str) => {
    let [from, to] = str.split(/ - /, 2)

    if (!from || !to) {
        return false
    }
    if (/ : /.test(to)) {
        to = to.split(/ : /, 2)[0]
    }
    if (HourToken.safeParse(from).error || HourToken.safeParse(to).error) {
        return false
    }
    return true
}, {
    message: "String does not match a duration line"
})
export type DurationLine = z.infer<typeof DurationLine>

export type LineComment = string

type TokenType = 'hour' | 'duration' | 'comment'

export interface Token {
    text: string;
    type: TokenType;
}

export class Hour implements Token {
    public text: string;
    public type: TokenType = 'hour';

    constructor(text: string) {
        this.text = text
    }
}

export class Duration implements Token {
    public text: string;
    public type: TokenType = 'duration';

    constructor(text: string) {
        this.text = text
    }

    public get hourTokens(): string[] {
        return this.text.split(/ - /, 2)
    }

    public get minutes(): number {
        const [from, to] = this.hourTokens
        const matchRegex = /^(\d{1,2})[h:](\d{2})$/i

        if (HourToken.safeParse(from).error || HourToken.safeParse(to).error) {
            return 0
        }
        const fromMatches = this.matchesToNumbers(from.match(matchRegex) as RegExpMatchArray)
        const toMatches = this.matchesToNumbers(to.match(matchRegex) as RegExpMatchArray)
        return this.numberPairsToMinutes(toMatches) - this.numberPairsToMinutes(fromMatches)
    }

    protected matchesToNumbers(matches: RegExpMatchArray): number[] {
        return matches.slice(1, 3).map((n) => parseInt(n, 10))
    }

    protected numberPairsToMinutes(numbers: number[]) {
        return (numbers[0] * 60) + numbers[1]
    }
}

export class Comment implements Token {
    public text: string;
    public type: TokenType = 'comment';

    constructor(text: string) {
        this.text = text
    }
}

export default class Tokenizer {
    protected _timesheet: string;
    protected _tokens: Token[] = []

    constructor(timesheet: string) {
        this._timesheet = timesheet
    }

    public tokenize() {
        this._timesheet.split(/\n/).forEach(line => {
            const trimmedLine = line.trim()
            if (this.isLineComment(trimmedLine)) {
                this._tokens.push(new Comment(this.getCommentFromLine(trimmedLine)))
            }
            if (this.isDurationLine(trimmedLine)) {
                this._tokens.push(new Duration(this.getDurationFromLine(trimmedLine)))
                if (this.hasDurationComment(trimmedLine)) {
                    this._tokens.push(new Comment(this.getDurationCommentFromLine(trimmedLine)))
                }
            }
        })
    }

    protected isLineComment(line: string): line is LineComment {
        return line[0] === '#' && !line.includes('\n')
    }

    protected isHour(token: string): token is HourToken {
        return HourToken.safeParse(token).success
    }

    protected isDurationLine(line: string): boolean {
        return DurationLine.safeParse(line).success
    }

    protected getCommentFromLine(line: string): LineComment {
        const [_, comment] = line.split(/#/, 2)
        return comment.trim()
    }

    protected getDurationFromLine(line: string): DurationToken {
        let [from, to] = line.split(/ - /, 2)
        if (this.hasDurationComment(to)) {
            to = to.split(/ : /, 2)[0]
        }

        return `${from} - ${to}` as DurationToken
    }

    protected getDurationCommentFromLine(line: string): DurationComment {
        const to = line.split(/ - /, 2)[1]
        return to.split(/ : /, 2)[1] as DurationComment
    }

    protected hasDurationComment(s: string): boolean {
        return / : .+$/.test(s)
    }

    public get tokens(): Token[] {
        return this._tokens
    }
}