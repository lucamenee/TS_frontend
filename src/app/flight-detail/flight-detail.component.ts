import { afterNextRender, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';

import { UserHttpService } from '../user-http.service';

import { Flight } from '../my_types/Flight'
import { User } from '../my_types/User';
import { error } from 'console';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css', './../../styles.css']
})
export class FlightDetail implements OnInit {
  flightId: string = '';
  flight!: Flight;
  myId !: string;

  constructor(private route: ActivatedRoute, private us: UserHttpService, private http: HttpClient, 
    public router: Router, private sio: SocketioService) {
    registerLocaleData(localeIt, 'it-It');
    afterNextRender(() => {
      this.myId = this.us.get_id();
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.flightId = params['id'];
      this.get_flight_details();
      this.sio.connect(this.flightId).subscribe(data => {
        console.log(data);
        this.flight = data;
      });
      // this.sio.onSeatAvailability().subscribe(data => {
      //   this.flight = data;
      // });
      
      
    });
  }
  
  // ngOnDestroy() {
  //   this.sio.unsubscribeFromFlight(this.flightId);
  // }

  

  get_flight_details() {
    this.http.get(this.us.url + '/flight?id=' + this.flightId).subscribe({
      next: (data: any) => {
        this.flight = data;
      },
      error: (err) => {
        console.log(err);
        this.router.navigate(['']);
      }
    });
  }

  bookSeat(id: string, number: string, price: number) {

    // controllo che utente sia registrato (se no alert)
    if (!this.us.is_logged()) {
      alert('Non sei loggato')
      return;
    }

    // manda alert per conferma con dati riepologativi
    if (confirm('Riepilogo: posto: ' + number + ', ' + price + ' € \n Conferma prenotazione')) {
      let passengerName = prompt("Nominativo del passeggero:", this.us.get_name() + ' ' + this.us.get_surname());
      if (!passengerName) {
        alert('Prenotazione annullata');
        return;
      }
      this.http.post(this.us.url + '/bookFlight', {
        flightId: this.flightId,
        seats: [id],
        passengerName: passengerName
      }, this.us.createHeaders()).subscribe({
        next: () => {
          alert('Prenotazione effettuata con successo');
        }, 
        error: (error) => {
          console.log(error)
        }
      })
    }

    
    
  }
  
  

}
