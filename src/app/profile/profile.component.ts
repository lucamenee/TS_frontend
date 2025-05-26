import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { ViewChild } from '@angular/core';

import { UserHttpService } from '../user-http.service';

import { Airport } from '../my_types/Airport';
import { Seat } from '../my_types/Seat';
import { FormsModule } from '@angular/forms';


interface Extra{
  name: string,
  price: number
}

interface myFlight {
  airline: {_id: string, name: string},
  departure: Airport,
  destination: Airport,
  departureDate: Date,
  destinationDate: Date,
  flightId: string,
  seats: [Seat]
  extrasAvailable: [Extra]
}


@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', './../../styles.css']
})
export class ProfileComponent implements OnInit {
  public mySeats: myFlight[] = [];
  public updatePswErrorMsg = undefined;
  public showPasswordUpdater: boolean = false;
  @ViewChild('oldPsw') inputOldPsw : any; 
  @ViewChild('newPsw') inputNewPsw : any; 
  showEditSeat: boolean = false;
  seatToEdit!: Seat;
  extrasAvailable!: Extra[];
  flightInvolved!: myFlight;

  constructor(public us: UserHttpService, private router: Router, private http: HttpClient) {

    if (!this.us.is_logged() || !this.us.get_token())
      this.router.navigate(['/login']);

    registerLocaleData(localeIt, 'it-It');

  }

  updateMyFlight() {
    this.http.get(this.us.url + '/myFlights', this.us.createHeaders()).subscribe({
      next: (data: any) => {
        this.mySeats = data;
      }, 
      error: (error) => {
        console.log(error.message)
      }
    });
  }

  ngOnInit(): void { 
    this.updateMyFlight();
  }

  updatePassword(oldPsw: string, newPsw: string) : void {
    if (!oldPsw || !newPsw) {
      alert('Tutti i campi sono obbligatori!');
      return;
    }
    this.http.post(this.us.url + '/updatePassword', {
      oldPsw: oldPsw,
      newPsw: newPsw,
    }, this.us.createHeaders()).subscribe({
      next: () => {
        console.log('password updated successfully');
        this.inputOldPsw.nativeElement.value = '';
        this.inputNewPsw.nativeElement.value = '';
        this.showPasswordUpdater = false;
        alert('Password aggiornata con successo');
        this.updatePswErrorMsg = undefined;
      },
      error: (error) => {
        console.log(error);
        this.updatePswErrorMsg = error.error.errormessage;
      }
    })
  }

  togglePasswordChanger() {
    this.showPasswordUpdater = !this.showPasswordUpdater;
    this.updatePswErrorMsg = undefined;
  }

  deleteBooking(flightId: string, seatId: string) {
    if (!confirm("Confermi l'eliminazione della prenotazione del volo?")) 
      return;
    this.http.delete(this.us.url + '/bookFlight', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
      body: {
        flightId: flightId,
        seatId: seatId,
      }
    }).subscribe({
      next: (d) => {
        console.log('booking deleted');
        this.updateMyFlight();
        alert('prenotazione eliminata con successo');
      },
      error: (error) => {
        console.log(error);
        alert(error.error.errormessage);
      }
    })
  }

  isAfterToday(date: Date): boolean {
    return new Date(date).getTime() > new Date().getTime();
  }

  
  createRange(number: any) {
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  hasExtra(name: string): boolean {
    for (let extra of this.seatToEdit.extras) 
      if (extra.name == name) return true
    return false;
  }

  removeExtra(extraToRemove: Extra) {
    for (let extra of this.seatToEdit.extras) 
      if (extra.name == extraToRemove.name) 
        this.seatToEdit.extras.splice(this.seatToEdit.extras.indexOf(extraToRemove), 1);
  }

  startEditing(flight: myFlight, seat: Seat) {
    this.showEditSeat = true; 
    this.seatToEdit = seat; 
    this.extrasAvailable = flight.extrasAvailable;
    this.flightInvolved = flight;
  }

  confirmEdit() {
    this.http.post(this.us.url + '/newExtras', {
      flightId: this.flightInvolved.flightId,
      seatId: this.seatToEdit._id,
      newExtras: this.seatToEdit.extras
    }, this.us.createHeaders()).subscribe({
      next: (d) => {
        alert('Dati aggiornati con successo');
        this.showEditSeat = false;
        this.updateMyFlight();
      },
      error: (error) => {
        alert("Errore nell'aggiornamento dei dati del biglietto: " + error.error.errormessage);
        this.showEditSeat = false;
        console.log(error)
      }
    })
  }

  sumExtra(seat: Seat): number {
    let result = 0;
    for(const extra of seat.extras) {
      result += extra.price;
    }
    return result
  }


  

}
