import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../my_types/User';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  public errmessage = undefined;

  constructor(private http: HttpClient, private us: UserHttpService) {}

  public createAirline(username: string, name: string, password: string, email: string) {
    
    this.us.register(username, name, password, email, 'AIRLINE', '').subscribe({
      next: (d) => {
        this.errmessage = undefined;
        alert('Utente creato con successo');

      },
      error: (err) => {
        console.log('Registrazion error: ' + JSON.stringify(err));
        this.errmessage = err.error.errormessage;
      }
    })
  }
}
