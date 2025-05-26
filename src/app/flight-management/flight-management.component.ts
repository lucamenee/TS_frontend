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
import { error } from 'node:console';
import { Seat } from '../my_types/Seat';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';


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
  imports: [CommonModule, FormsModule, MatTooltipModule],
  templateUrl: './flight-management.component.html',
  styleUrls: ['./../../styles.css', './flight-management.component.css']
})
export class FlightManagementComponent {

  airports!: Observable<Airport[]>;
  myRoutes: Route[] = [];
  fromDate: Date;
  filteredRoutes!: Route[];
  showAddFlight: boolean = false;
  showEditFlight: boolean = false;
  flightToEdit!: Flight;
  myAircrafts!: Observable<Aircraft[]>;
  extras: Extra[] = [{name: '', price: NaN},{name: '', price: NaN}];

  constructor(private http: HttpClient, private us: UserHttpService, public router: Router) {
    registerLocaleData(localeIt, 'it-It');
    this.updateMyRoutes();
    this.airports = this.http.get<Airport[]>(this.us.url + '/airports');
    this.fromDate= new Date();
    this.myAircrafts = this.http.get<Aircraft[]>(this.us.url + '/aircrafts ', this.us.createHeaders());
  }

  updateMyRoutes() {
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
        this.updateMyRoutes();
      },
      error: (error) => {
        console.log(error);
        alert('Errore nella creazione del volo: ' + error.error.errormessage);
      }
    })
    
  }

  daysDateDiffFromNow(date: string | Date): number {
    const now = new Date();
    const target = new Date(date);
    return Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  addExtraFlight(flight: Flight) {
    flight.extrasAvailable.push({name: '', price: NaN});
  }

  updateFlight(departureDate: string, destinationDate: string, economyPrice: number, businessPrice: number, firstClassPrice: number) {
    var body: {
      flightId: string,
      departureDate: Date,
      destinationDate: Date,
      extras: { name: string; price: number; }[],
      economyPrice?: number,
      businessPrice?: number,
      firstClassPrice?: number
    } = {
      flightId: this.flightToEdit._id,
      departureDate: new Date(departureDate),
      destinationDate: new Date(destinationDate),
      extras: this.flightToEdit.extrasAvailable
    };
    if (economyPrice > 0)
      body.economyPrice = economyPrice;
    if (businessPrice > 0)
      body.businessPrice = businessPrice;
    if (firstClassPrice > 0)
      body.firstClassPrice = firstClassPrice;
    
    this.http.post(this.us.url + '/updateFlight', body, this.us.createHeaders()).subscribe({
      next: (d) => {
        alert('Volo aggiornato con successo');
        this.showEditFlight = false;
        this.updateMyRoutes();
      },
      error: (error) => {
        alert("Errore nell'aggiornamento del volo " + error.error.errormessage);
        console.log(error);
      }
    })
  }

  deleteFlight(flightId: string) {
    if (confirm('Conferma eliminazione volo'))
      this.http.delete(this.us.url + '/deleteFlight', {
        headers:new HttpHeaders({
          'cache-control': 'no-cache',
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + this.us.get_token()
        }),
        body: {
          flightId: flightId
        }
      }).subscribe({
        next: (d) => {
          console.log('flight deleted');
          alert('Volo eliminato con successo');
          this.updateMyRoutes();
        },
        error: (error) => {
          console.log(error);
          alert(error.error.errormessage);
        }
      })
  }

  seatsBooked(flight: Flight): number {
    let result: number = 0;
    for(const seat of flight.aircraft.economySeats) {
      if (seat.passenger)  result++;
    }
    for(const seat of flight.aircraft.businessSeats) {
      if (seat.passenger) result++;
    }
    for(const seat of flight.aircraft.firstClassSeats) {
      if (seat.passenger) result++;
    }

    return result;
  }

  totalSeats(flight: Flight): number {
    let result: number = 0;
    result += flight.aircraft.economySeats.length;
    result += flight.aircraft.businessSeats.length;
    result += flight.aircraft.firstClassSeats.length;

    return result;
  }

  totalPossibleIncome(flight: Flight): number {
    let result: number = 0;

    function calcIncome (seats: Seat[]) : number {
      let result = 0;
      for(let seat of seats) {
        result += seat.seatPrice;
        for (let extra of seat.extras) {
          result += extra.price;
        }
      }
      return result;
    }

    result += calcIncome(flight.aircraft.economySeats);
    result += calcIncome(flight.aircraft.businessSeats);
    result += calcIncome(flight.aircraft.firstClassSeats);

    return result;
  }

  calcExtraPrice(seat: Seat): number {
    let result: number = 0;
    for (const extra of seat.extras) {
      result += extra.price;
    }
    return result;
  }
 

  incomeSeatsBooked(flight: Flight): number {
    let result: number = 0;

    function calcIncome (seats: Seat[]) : number {
      let result = 0;
      for(let seat of seats) {
        if (seat.passenger) {
          result += seat.seatPrice;
          for (let extra of seat.extras) {
            result += extra.price;
          }
        }
      }
      return result;
    }

    result += calcIncome(flight.aircraft.economySeats);
    result += calcIncome(flight.aircraft.businessSeats);
    result += calcIncome(flight.aircraft.firstClassSeats);

    return result;
  }

  seatsEmpty(flight: Flight): number {
    let result: number = this.totalSeats(flight);
    result += this.seatsBooked(flight);

    return result;
  }

  incomeSeatsEmpty(flight: Flight): number {
    let result = this.totalPossibleIncome(flight);
    result -= this.incomeSeatsBooked(flight);
    return result;
  }

  getSeatTooltip(seat: any): string {
  let tooltip = `Passeggero: ${seat.passenger?.name || seat.passengerName}`;
  if (seat.extras && seat.extras.length > 0) {
    tooltip += '\nExtra: ' + seat.extras.map((e: any) => e.name).join(', ');
  }
  return tooltip;
}


}
