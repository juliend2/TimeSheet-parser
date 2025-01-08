import Tokenizer, { Token, Comment, Duration } from "./tokenizer"

type GroupedToken = Comment & {
    durations: Duration[]
}

type Total = Comment & {
    totalTime: number
}

type Expand<T> = { [K in keyof T]: T[K] };
type b = Expand<GroupedToken>
// type ExpandedGroupedToken = Expand<GroupedToken>

export default class Parser {

    protected _tokenizer: Tokenizer
    protected _tree: GroupedToken[]

    constructor(tokenizer: Tokenizer) {
        this._tokenizer = tokenizer
    }

    public groupByComments(): void {

        this._tokenizer.tokenize()
        this._tree = this._tokenizer.tokens.reduce<GroupedToken[]>((accumulator, current) => {
            if (current.type === 'comment') {
                return [...accumulator, { ...current, durations: [] }]
            }
            if (current.type === 'duration' && accumulator.length > 0) {
                const newAccumulator = accumulator
                newAccumulator[accumulator.length - 1].durations.push(current as Duration)
                return newAccumulator
            }
            return accumulator
        }, [])
    }

    public get tokens(): Token[] {
        return this._tokenizer.tokens
    }

    public get tree(): GroupedToken[] {
        return this._tree
    }

    public get totals(): Total[] {
        return this._tree.map((groupedToken: GroupedToken) => {
            const total = groupedToken.durations.reduce((durations, curr) => (durations + curr.minutes), 0)
            return { type: 'comment', text: groupedToken.text, totalTime: total } as Total
        })
    }

}