export type HourToken = `${number}h${number}` | `${number}:${number}`
export type DurationComment = string
export type DurationToken = `${HourToken} - ${HourToken}`// | `${HourToken} - ${HourToken} ${DurationComment}`
export type DurationLine = `${HourToken} - ${HourToken} ${DurationComment}`
export type LineComment = `# ${string}`
export type Comment = LineComment | DurationComment

export type Token = HourToken | DurationToken | Comment

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
                this._tokens.push(trimmedLine)
            }
            if (this.isDurationLine(trimmedLine)) {
                if (this.hasDurationComment(trimmedLine)) {
                } else {
                    this._tokens.push(trimmedLine)
                }
                this._tokens.push(this.getDurationFromLine(trimmedLine))
                if (this.hasDurationComment(trimmedLine)) {
                    this._tokens.push(this.getDurationCommentFromLine(trimmedLine))
                }
            }
        })
    }

    protected isLineComment(line: string): line is LineComment {
        return line[0] === '#' && !line.includes('\n')
    }

    protected isDurationLine(line: string): line is DurationLine {
        let [from, to] = line.split(/ - /, 2)
        if (!from || !to) {
            return false
        }
        if (this.hasDurationComment(to)) {
            to = to.split(/ : /, 2)[0]
        }
        if (!this.isHour(from)) {
            return false
        }
        if (!this.isHour(from) || !this.isHour(to)) {
            return false
        }
        return true
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
        return to.split(/ : /, 2)[1]
    }

    protected isHour(token: string): token is HourToken {
        return /\d{1,2}[:h]\d{1,2}/.test(token)
    }

    protected hasDurationComment(s: string): boolean {
        return / : .+$/.test(s)
    }

    public get tokens(): Token[] {
        return this._tokens
    }
}