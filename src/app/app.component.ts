import { CommonModule } from '@angular/common';
import { afterNextRender, Component, NgZone } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { UserHttpService } from './user-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
})
export class AppComponent {

  constructor(private ngZone: NgZone, public router: Router, public us: UserHttpService) {
    // Check if the user is logged in (e.g., check token in localStorage)
    
  }

  
}
