import { afterNextRender, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserHttpService } from '../user-http.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { after } from 'node:test';

@Component({
  selector: 'app-signup',
  imports: [CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../login/login.component.css']
})
export class SignupComponent {

  public errmessage!: string;

  constructor(public router: Router, public us: UserHttpService, private http: HttpClient) {
    afterNextRender(() => {
      localStorage.removeItem('tailwind_token');
    })
  }

  register(name: string, surname: string, username: string, email: string, password: string) {
    this.http.post(this.us.url + '/register', {
      name: name,
      surname: surname,
      username: username,
      email: email,
      password: password,
      role: 'PASSENGER'
    }).subscribe({
      next: (d) => {
        console.log('user registration completed!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
        this.errmessage = err.error.errormessage;
      }
    })
  }
}
