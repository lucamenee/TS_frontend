import { CommonModule } from '@angular/common';
import { afterNextRender, Component, NgZone } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
})
export class AppComponent {
  isLoggedIn = false; // Replace with actual login state logic

  constructor(private ngZone: NgZone,private router: Router) {
    // Check if the user is logged in (e.g., check token in localStorage)
    afterNextRender(() => {
      this.isLoggedIn = !!localStorage.getItem('tailwind_token');
    })
  }

  logout() {
    // Clear the token and update login state
    this.ngZone.run(() => {
      localStorage.removeItem('tailwind_token');
    })
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
