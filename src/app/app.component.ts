import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Airport } from './my_types/Airport';
import { Flight } from './my_types/Flight';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  
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
}
