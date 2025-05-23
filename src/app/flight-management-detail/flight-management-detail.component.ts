import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Flight } from '../my_types/Flight';

@Component({
  selector: 'app-flight-management-detail',
  imports: [],
  templateUrl: './flight-management-detail.component.html',
  styleUrl: './flight-management-detail.component.css'
})
export class FlightManagementDetailComponent {

  flightId: string = '';
  flight!: Flight;

  constructor(private http: HttpClient, private us: UserHttpService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe((params: any) => {
      this.flightId = params['id'];
      this.http.get(this.us.url + '/flight?id=' + this.flightId).subscribe({
        next: (data: any) => {
          this.flight = data;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['airline/flights']);
        }
      });
    });
  }
    

}
