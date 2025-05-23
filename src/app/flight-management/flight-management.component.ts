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
import { Aircraft } from '../my_types/Aircraft';


interface Route {
  _id: any,
  flights: Flight[],
  departure: Airport,
  destination: Airport,
  show: boolean
}

interface Extra {name: string, price: number}

@Component({
  selector: 'app-flight-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-management.component.html',
  styleUrls: ['./../../styles.css', './flight-management.component.css']
})
export class FlightManagementComponent {

  airports!: Observable<Airport[]>;
  myRoutes: Route[] = [];
  fromDate: Date;
  filteredRoutes!: Route[];
  showAddFlight: boolean = false;
  myAircrafts!: Observable<Aircraft[]>;
  extras: Extra[] = [{name: '', price: NaN},{name: '', price: NaN}];

  constructor(private http: HttpClient, private us: UserHttpService, public router: Router) {
    registerLocaleData(localeIt, 'it-It');
    this.updatedMyRoutes();
    this.airports = this.http.get<Airport[]>(this.us.url + '/airports');
    this.fromDate= new Date();
    this.myAircrafts = this.http.get<Aircraft[]>(this.us.url + '/aircrafts ', this.us.createHeaders());
  }

  updatedMyRoutes() {
    this.http.get<Route[]>(this.us.url + '/myRoutes', this.us.createHeaders()).subscribe({
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

  createRange(number: any) {
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  addExtra() {
    this.extras.push({name: '', price: NaN});
  }

  addFlight(departure: string, destination: string, aircraft: string, departureDate: string, destinationDate: string) {
    if (!departure) {
      alert('Partenza è un campo obbligatorio');
      return;
    }
    if (!destination) {
      alert('Arrivo è un campo obbligatorio');
      return;
    }
    if (!aircraft) {
      alert('Aereo è un campo obbligatorio');
      return;
    }
    if (!departureDate) {
      alert('Orario decollo è un campo obbligatorio');
      return;
    }
    if (!destinationDate) {
      alert('Orario arrivo è un campo obbligatorio');
      return;
    }
    if (departure == destination) {
      alert('Partenza e destinazione devono essere due aereoporti distinti');
      return;
    }
    let departureDateTime = new Date(departureDate);
    let destinationDateTime = new Date(destinationDate);
    
    if (departureDateTime > destinationDateTime) {
      alert("L'orario di arrivo deve essere successivo a quello di partenza");
      return;
    }
    let extrasToAdd = this.extras.filter(extra => extra.name && extra.name!=' ' && !Number.isNaN(extra.price));
    
    this.http.post(this.us.url + '/createFlight', {
      departure: departure,
      destination: destination,
      departureDate: departureDate,
      destinationDate: destinationDate,
      aircraftId: aircraft,
      extras: extrasToAdd
    }, this.us.createHeaders()).subscribe({
      next: (d) => {
        alert('Volo create');
        this.showAddFlight=false;
        this.updatedMyRoutes();
      },
      error: (error) => {
        console.log(error);
        alert('Errore nella creazione del volo: ' + error.error.errormessage);
      }
    })
    
  }


}
