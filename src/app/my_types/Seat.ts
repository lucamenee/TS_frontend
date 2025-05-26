export interface Seat {
    class: string;
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