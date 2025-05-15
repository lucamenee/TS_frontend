import { afterNextRender, Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { User } from '../my_types/User';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {

  public errmessage!: string;

  constructor(private us: UserHttpService, private router: Router) { }

  ngOnInit(): void {
    // Initialization logic can go here
    console.log('LoginComponent initialized');
  }

  login(username: string, password: string) {
    this.us.login(username, password).subscribe({
      next: (d) => {
        console.log('Login granted, calling router.navigate(/)');
        this.errmessage = '';
        if (this.us.is_passenger())
          this.router.navigate(['/']);
        if (this.us.is_airline())
          this.router.navigate(['/airline']);
        if (this.us.is_admin())
          this.router.navigate(['/admin']);

      },
      error: (err) => {
        console.log('Login error: ' + JSON.stringify(err));
        this.errmessage = 'username o password errati';
      }
    });

  }

}
