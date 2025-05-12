import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { UserHttpService } from '../user-http.service';

import { Flight } from '../my_types/Flight'

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css']
})
export class FlightDetail implements OnInit {
  flightId: string = '';
  flight!: Flight;

  constructor(private route: ActivatedRoute, private us: UserHttpService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.flightId = params['id'];
      this.http.get(this.us.url + '/flight?id=' + this.flightId).subscribe({
        next: (data: any) => {
          this.flight = data;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['']);
        }
      });
      
      
    });
  }
}
