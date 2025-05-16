import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../my_types/User';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  public airlineerrmessage = undefined;
  public deleteusererrmessage = undefined;
  public users!: Observable<User[]>;
  selectedUser: string = '';

  passwordText: string = '';  
  emailText: string = '';
  usernameText: string = '';
  nameText: string = '';

  constructor(private http: HttpClient, private us: UserHttpService) {
    this.getUsers();
  }

  getUsers() {
    this.users = this.http.get<User[]>(this.us.url + '/users', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      })
    })
  }

  public createAirline(username: string, name: string, password: string, email: string) {
    
    this.us.register(username, name, password, email, 'AIRLINE', '').subscribe({
      next: (d) => {
        this.airlineerrmessage = undefined;
        alert('Utente creato con successo');
        this.getUsers();
        this.passwordText = '';
        this.emailText = '';
        this.usernameText = '';
        this.nameText = '';
      },
      error: (error) => {
        console.log(error);
        this.airlineerrmessage = error.error.errormessage;
      }
    })

  }

  public deleteUser() {
    this.http.delete(this.us.url + '/user', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      body: {
        id: this.selectedUser
      }
    }).subscribe({
      next: (d) => {
        console.log(d);
        this.deleteusererrmessage = undefined;
        this.getUsers();
        alert('Utente eliminato con successo');
      },
      error: (error) => {
        console.log(error);
        this.deleteusererrmessage = error.error.errormessage;
      }
    })
  }

}
