import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { Airport } from '../my_types/Airport';
import { Flight } from '../my_types/Flight';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';


interface RevenuesStats {
  totalRevenue: number,
  flights: [{
    flightId: string,
    departure: Airport,
    destination: Airport,
    date: string,
    revenue: number
  }]
}

interface PassengerStats {
  flightId: string,
  departure: Airport,
  destination: Airport,
  date: string,
  passengers: number,
  details: {
    economy: number,
    business: number,
    first: number
  }
}

interface TopRouteStats {
  _id: string,
  totalPassengers: number,
  departure: Airport,
  destination: Airport,
  flights: [{
    _id: string,
    departureDate: string,
    passengers: number
  }]
}

@Component({
  selector: 'app-statistics',
  imports: [CommonModule, MatTooltip],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css', './../../styles.css']
})
export class StatisticsComponent {

  revenues!: RevenuesStats;
  passengersStats!: PassengerStats[];
  topRoutes!: TopRouteStats[];

  constructor(private http: HttpClient, private us: UserHttpService) {
    this.http.get(this.us.url + '/stats/revenue', this.us.createHeaders()).subscribe({
      next: (data: any) => {
        this.revenues = data;
        console.log(this.revenues)
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.http.get(this.us.url + '/stats/passengers', this.us.createHeaders()).subscribe({
      next: (data: any) => {
        this.passengersStats = data;
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.http.get(this.us.url + '/stats/topRoutes', this.us.createHeaders()).subscribe({
      next: (data: any) => {
        this.topRoutes = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // Add this method inside your StatisticsComponent class
getFlightsTooltip(flights: any[]): string {
  return flights.map(f => `${new Date(f.departureDate).toLocaleDateString('it-IT')}, ${f.passengers} passeggeri`).join('\n');
}
  

}
