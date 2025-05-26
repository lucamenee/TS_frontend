export interface Seat {
    seatNumber: string,
    passenger: string,
    seatPrice: number,
    passengerName: string,
    extras: [{
        price: number,
        name: string,
    }],
    _id: string,
    editing: boolean,
}