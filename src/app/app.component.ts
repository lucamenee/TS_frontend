import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Airport } from './my_types/Airport';
import { Flight } from './my_types/Flight';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  
  readonly ROOT_URL = 'http://localhost:1337';
  
  title = 'frontend';
  airports!: Observable<Airport[]>;
  flights!: Observable<Flight[]>;
  selectedDeparture: string = '';
  selectedDestination: string = '';

  constructor(private http: HttpClient) { 
    this.airports = this.http.get<Airport[]>(this.ROOT_URL + '/airports');
  }

  getAirports() {
    this.airports = this.http.get<Airport[]>(this.ROOT_URL + '/airports');
  }

  getFlights() {
    // let params = new HttpParams().set('departure', this.selectedDeparture).set('destination', this.selectedDestination);
    let print = this.ROOT_URL + '/flights?departure=' + this.selectedDeparture + '&destination=' + this.selectedDestination;
    console.log(print);
    this.flights = this.http.get<Flight[]>(print);
  }

}
