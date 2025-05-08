import { Seat } from "./Seat";

export interface Aircraft {
    modelName: string,
    producer: string,
    airline: string,
    economySeats: Seat[],
    businessSeats: Seat[],
    firstClassSeats: Seat[],
}