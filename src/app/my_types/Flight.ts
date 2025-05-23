import { Airport } from "./Airport"
import { Aircraft } from "./Aircraft"

export interface Flight {
    _id: string,
    departure: Airport,
    destination: Airport,
    departureDate: string,
    destinationDate: string,
    aircraft: Aircraft,
    extrasAvailable: {name: string, price: number}[],
}

