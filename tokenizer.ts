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

export interface Token {
    text: string;
    type: string;
}

export class Hour implements Token {
    public text: string;
    public type: string = 'hour';

    constructor(text: string) {
        this.text = text
    }
}

export class Duration implements Token {
    public text: string;
    public type: string = 'duration';

    constructor(text: string) {
        this.text = text
    }
}

export class Comment implements Token {
    public text: string;
    public type: string = 'comment';

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