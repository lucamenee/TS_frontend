import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Airport } from '../my_types/Airport';
import { Flight } from '../my_types/Flight';

@Component({
  selector: 'flight-search',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css',
  standalone: true
})
export class FlightSearch {
 
  readonly ROOT_URL = 'http://localhost:1337';
  
  title = 'frontend';
  airports!: Observable<Airport[]>;
  flights!: Observable<{
    directFlights: Flight[]; 
    connectingFlights: [{
      firstLeg: Flight;
      secondLeg: Flight
    }]
  }>;
  // directFlights!: Observable<Flight[]>;
  // connectingFlights!: Observable<Flight[]>;
  selectedDeparture: string = '';
  selectedDestination: string = '';
  showDirectFlights: boolean = true; // Controls visibility of direct flights
  showConnectedFlights: boolean = true; // Controls visibility of connected flights

  constructor(private http: HttpClient) { 
    this.airports = this.http.get<Airport[]>(this.ROOT_URL + '/airports');
  }

  getAirports() {
    this.airports = this.http.get<Airport[]>(this.ROOT_URL + '/airports');
  }

  getFlights() {
    const url = `${this.ROOT_URL}/flights?departure=${this.selectedDeparture}&destination=${this.selectedDestination}`;
    console.log('Fetching flights from:', url);

    this.flights = this.http.get<{ directFlights: Flight[]; connectingFlights:[{
      firstLeg: Flight;
      secondLeg: Flight
    }] }>(url);
  }

  printTimeTranfer(arg0: string, arg1: string): string {
    const firstDate = new Date(arg0).getTime();
    const secondDate = new Date(arg1).getTime();
    const differenceInMilliseconds = Math.abs(secondDate - firstDate);

    const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60)); 
    const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); 
    
    return `${hours} h ${minutes} m`; 
  }

  minPrice(flight: Flight): number {
    let minPrice: number = Infinity;
    for (let seat of flight.aircraft.economySeats) {
      if (seat.seatPrice < minPrice && seat.passenger == null) minPrice = seat.seatPrice;      
    } 

    for (let seat of flight.aircraft.businessSeats) {
      if (seat.seatPrice < minPrice && seat.passenger == null) minPrice = seat.seatPrice;      
    } 

    for (let seat of flight.aircraft.firstClassSeats) {
      if (seat.seatPrice < minPrice && seat.passenger == null) minPrice = seat.seatPrice;      
    } 

    return minPrice;
  }

}
