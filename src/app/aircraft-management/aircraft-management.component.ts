import { Component } from '@angular/core';
import { Aircraft } from '../my_types/Aircraft';
import { UserHttpService } from '../user-http.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { error } from 'console';
import { FormsModule } from '@angular/forms';
import { Seat } from '../my_types/Seat';

@Component({
  selector: 'app-aircraft-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './aircraft-management.component.html',
  styleUrls: ['./aircraft-management.component.css', './../../styles.css']
})
export class AircraftManagementComponent {

  aircrafts!: Observable<Aircraft[]>;
  showAddAircraft = false;

  constructor(private http: HttpClient, private us: UserHttpService) {    
    this.updateAircrafts();
  }

  updateAircrafts() {
    this.aircrafts = this.http.get<Aircraft[]>(this.us.url + '/aircrafts', this.us.createHeaders())
  }

  addSeat(aircraft: string, number: string, price: number, seatClass: string) {
    this.http.post(this.us.url + '/addSeat', {
      aircraftId: aircraft,
      price: price,
      number: number,
      seatClass: seatClass
    }, this.us.createHeaders()).subscribe({
      next: (d) => {
        console.log('aggiunto');
        alert('posto aggiunto');
        this.updateAircrafts();
      },
      error: (error) => {
        console.log(error);
        alert("errore nell'inserimento: " + error.error.errormessage);
      }
    })
  }

  updateSeatPrice(aircraftId: string, seatId: string, newPrice: number, seatClass: string) {
    this.http.post(this.us.url + '/updateSeatPrice', {
      aircraftId: aircraftId,
      seatId: seatId,
      newPrice: newPrice,
      seatClass: seatClass
    }, this.us.createHeaders()).subscribe({
      next: () => {
        this.updateAircrafts(); // Refresh the list
      },
      error: (error) => {
        alert("Errore nell'aggiornamento: " + error.error.errormessage);
        console.log(error)
      }
    });
  }


  private checkCreateFlightInputs(producer: string, model: string, numberStartE: number, numberEndE: number, colsE: number, priceE: number,
    numberStartB: number, numberEndB: number, colsB: number, priceB: number,
     numberStartF: number, numberEndF: number, colsF: number, priceF: number
  ): boolean {
    if (!producer) {
      alert("Non è stato inserito il campo del produttore");
      return false;
    }
    if (!model) {
      alert("Non è stato inserito il campo del modello");
      return false;
    } 

    if (numberStartE > numberEndE) {
      alert("Il numero della prima riga dell'economy deve essere inferiore a quello dell'ultima");
      return false;
    }
    if (colsE <= 0) {
      alert("Bisogna inserire almeno una colonna di posti economy");
      return false;
    }
    if (!priceE) {
      alert("Bisogna inserire il prezzo dei posti economy");
      return false;
    }

    console.log(numberStartB, numberEndB)

    if (numberStartB > numberEndB) {
      alert("Il numero della prima riga della business deve essere inferiore a quello dell'ultima");
      return false;
    }
    if (colsB <= 0) {
      alert("Bisogna inserire almeno una colonna di posti business");
      return false;
    }
    if(colsB && !priceB) {
      alert("Definisci anche i prezzi della business");
      return false;
    }
    if (!colsB && priceB) {
      alert("Definisci anche le colonne della business");
      return false;
    }

    if (numberStartF > numberEndF) {
      alert("Il numero della prima riga della first deve essere inferiore a quello dell'ultima");
      return false;
    }
    if (colsF <= 0) {
      alert("Bisogna inserire almeno una colonna di posti first");
      return false;
    }
    if(colsF && !priceF) {
      alert("Definisci anche i prezzi della first");
      return false;
    }
    if (!colsF && priceF) {
      alert("Definisci anche le colonne della first");
      return false;
    }

    return true;
  }

  createFlight(producer: string, model: string, numberStartE: number, numberEndE: number, colsE: number, priceE: number,
    numberStartB: number, numberEndB: number, colsB: number, priceB: number,
     numberStartF: number, numberEndF: number, colsF: number, priceF: number
  ) {

    if (!this.checkCreateFlightInputs(producer, model, numberStartE, numberEndE, colsE, priceE,
    numberStartB, numberEndB, colsB, priceB, numberStartF, numberEndF, colsF, priceF))
      return;

    let seatsE = this.generateSeats(numberStartE, numberEndE, colsE, priceE);
    let seatsB = this.generateSeats(numberStartB, numberEndB, colsB, priceB);
    let seatsF = this.generateSeats(numberStartF, numberEndF, colsF, priceF);

    this.http.post(this.us.url + '/aircraft', {
      producer: producer,
      modelName: model,
      seatsE: seatsE,
      seatsB: seatsB,
      seatsF: seatsF,
    }, this.us.createHeaders()).subscribe({
      next: (d) => {
        console.log('aircraft created');
        this.updateAircrafts();
      },
      error: (error) => {
        console.log(error);
        alert(error.error.errormessage);
      }
    })

  }


  generateSeats(numberStart: number, numberEnd: number, cols: number, price: number): any[] {
  const seats: any[] = [];

  for (let i=numberStart; i<=numberEnd; i++) {
    for (let col=0; col<cols; col++) {
      seats.push({
        seatNumber: i+String.fromCharCode(65+col),
        seatPrice: price
      });
    }    
  }
  return seats;
  }

  totSeats(aircraft: Aircraft): number {
    return aircraft.economySeats.length + aircraft.businessSeats.length + aircraft.firstClassSeats.length;
  }



}
