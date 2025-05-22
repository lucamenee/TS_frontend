import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { Flight } from '../my_types/Flight';
import { Airport } from '../my_types/Airport';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';


interface Route {
  _id: any,
  flights: Flight[],
  departure: Airport,
  destination: Airport,
  show: boolean
}

@Component({
  selector: 'app-flight-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-management.component.html',
  styleUrl: './flight-management.component.css'
})
export class FlightManagementComponent {

  airports!: Observable<Airport[]>;
  myRoutes: Route[] = [];
  fromDate: Date;

  constructor(private http: HttpClient, private us: UserHttpService, public router: Router) {
    registerLocaleData(localeIt, 'it-It');
    this.updatedMyRoutes();
    this.airports = this.http.get<Airport[]>(this.us.url + '/airports');
    this.fromDate= new Date();
  }

  updatedMyRoutes() {
    this.http.get<Route[]>(this.us.url + '/myRoutes', {
      headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      })
    }).subscribe({
      next: (routes) => {
        this.myRoutes = this.filteredRoutes = routes;
        for(const route of this.myRoutes) {
          route.flights.sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime());
        }
      }, 
      error: (error) => {
        console.log(error);
        alert("Nel caricamento delle rotte: " + error.error.errormessage);
      }
    });

  }

  filteredRoutes!: Route[];

  filterRoutes(departure: string, destination: string, dateFrom: string) {
    return this.myRoutes.filter(route => {
      const matchesDeparture = !departure || route.departure._id == departure;
      const matchesDestination = !destination || route.destination._id == destination;

      const matchesDate = !dateFrom || route.flights.some(flight => {
        const flightDate = new Date(flight.departureDate);
        const filterDate = new Date(dateFrom);
        // Compare only the date part
        return flightDate.getTime() >= filterDate.getTime();
      });
      return matchesDeparture && matchesDestination && matchesDate;
    });
  }


}
