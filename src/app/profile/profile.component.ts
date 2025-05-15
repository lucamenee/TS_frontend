import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';

import { UserHttpService } from '../user-http.service';

import { Airport } from '../my_types/Airport';


interface myFlight {
  airline: {_id: string, name: string},
  departure: Airport,
  destination: Airport,
  departureDate: Date,
  destinationDate: Date,
  flightId: string,
  seats: [{seatNumber: string, seatPrice: number}]
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public mySeats: myFlight[] = [];

  constructor(public us: UserHttpService, private router: Router, private http: HttpClient) {

    if (!this.us.is_logged() || !this.us.get_token())
      this.router.navigate(['/login']);

    registerLocaleData(localeIt, 'it-It');

  }

  ngOnInit(): void {
    


    this.http.get(this.us.url + '/myFlights',  {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    }).subscribe({
      next: (data: any) => {
        this.mySeats = data;
        console.log(this.mySeats)
      }, 
      error: (error) => {
        console.log(error.message)
      }
    });

  }

  

}
