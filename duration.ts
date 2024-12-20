import Hour from './hour'

export type PositiveNumber = number & { __brand: 'PositiveNumber' };

function assertPositiveNumber(x: number): asserts x is PositiveNumber {
    if (x < 0) throw new Error('Number is not positive');
}

export default class Duration {
    protected from: Hour
    protected to: Hour

    public constructor(from: Hour, to: Hour) {
        this.from = from
        this.to = to
    }

    public inMinutes(): PositiveNumber {
        const result = this.to.toMinutes() - this.from.toMinutes()
        assertPositiveNumber(result);
        return result
    }
}