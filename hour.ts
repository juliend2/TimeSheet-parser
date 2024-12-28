import { HourToken } from "./tokenizer"

export default class Hour {
    static readonly MINUTES_IN_HOUR: number = 60

    protected hourWithMinutes: HourToken

    public constructor(hourWithMinutes: HourToken) {
        this.hourWithMinutes = hourWithMinutes
    }

    public toMinutes(): number {
        const [hours, minutes] = this.hourWithMinutes.split(/[:h]/).map(s => parseInt(s))
        return (hours * Hour.MINUTES_IN_HOUR) + minutes
    }
}