import { Seat } from "./Seat";
import { User } from "./User"

export interface Aircraft {
    modelName: string,
    producer: string,
    airline: User,
    economySeats: Seat[],
    businessSeats: Seat[],
    firstClassSeats: Seat[],
}