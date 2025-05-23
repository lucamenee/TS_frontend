import { Component, OnInit, ɵsetAlternateWeakRefImpl } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { ViewChild } from '@angular/core';

import { UserHttpService } from '../user-http.service';

import { Airport } from '../my_types/Airport';
import { Seat } from '../my_types/Seat';


interface myFlight {
  airline: {_id: string, name: string},
  departure: Airport,
  destination: Airport,
  departureDate: Date,
  destinationDate: Date,
  flightId: string,
  seats: [Seat]
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public mySeats: myFlight[] = [];
  public updatePswErrorMsg = undefined;
  public showPasswordUpdater: boolean = false;
  @ViewChild('oldPsw') inputOldPsw : any; 
  @ViewChild('newPsw') inputNewPsw : any; 


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

  

}
