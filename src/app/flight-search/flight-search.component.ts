import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Airport } from '../my_types/Airport';
import { Flight } from '../my_types/Flight';

@Component({
  selector: 'flight-search',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css', './../../styles.css'],
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
  
  selectedDeparture: string = '';
  selectedDestination: string = '';
  showAdvancedSearch: boolean = false;
  stops: boolean = true;
  fromDate: Date = new Date();
  maxPrice: number = 1000;

  constructor(private http: HttpClient, public router: Router) { 
    this.getAirports();
  }

  getAirports() {
    this.airports = this.http.get<Airport[]>(this.ROOT_URL + '/airports');
  }

  getFlights() {
    const url = `${this.ROOT_URL}/flights?departure=${this.selectedDeparture}&destination=${this.selectedDestination}&fromDate=${this.fromDate}`;
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

  filterDirectFlights(flights: Flight[]) {
    let result: Flight[] = [];
    
    for (const flight of flights) {
      if (this.minPrice(flight) <= this.maxPrice)
        result.push(flight);
    }

    return result;
  }

  filterConnectingFlights(flights: {firstLeg: Flight, secondLeg: Flight}[]) {
    let result = [];

    for (const flight of flights) {
      if (this.minPrice(flight.firstLeg) + this.minPrice(flight.secondLeg) < this.maxPrice) 
        result.push(flight);
    }

    return result;
  }

}
