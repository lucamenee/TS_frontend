import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-airline',
  imports: [],
  templateUrl: './airline.component.html',
  styleUrl: './airline.component.css'
})
export class AirlineComponent {
  constructor(public router: Router) {}

}
