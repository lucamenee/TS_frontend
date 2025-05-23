import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../my_types/User';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Nation } from '../my_types/Nation';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  public airlineerrmessage = undefined;
  public deleteusererrmessage = undefined;
  public airporterrmessage = undefined;
  public nationerrmessage = undefined;

  public users!: Observable<User[]>;
  public nations!: Observable<Nation[]>;

  selectedUser: string = '';

  passwordText: string = '';  
  emailText: string = '';
  usernameText: string = '';
  nameText: string = '';

  IATAText: string = '';
  cityText: string = '';
  airportNameText: string = '';
  selectedNation: string = '';
  
  nationNameText: string = '';

  public toastMessage: string | undefined;

  constructor(private http: HttpClient, private us: UserHttpService, private cdRef: ChangeDetectorRef) {
    this.getUsers();
    this.getNations();
  }

  getUsers() {
    this.users = this.http.get<User[]>(this.us.url + '/users', this.us.createHeaders())
  }

  getNations() {
    this.nations = this.http.get<Nation[]>(this.us.url + '/nations');
  }

  public createAirline(username: string, name: string, password: string, email: string) {
    this.us.register(username, name, password, email, 'AIRLINE', '').subscribe({
      next: (d) => {
        this.airlineerrmessage = undefined;
        this.showToast('Utente creato con successo'); // <-- Use toast
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
    });
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
        this.showToast('Utente eliminato con successo');      
      },
      error: (error) => {
        console.log(error);
        this.deleteusererrmessage = error.error.errormessage;
      }
    })
  }

  showToast(message: string, duration: number = 2000) {
    this.toastMessage = message;
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.toastMessage = undefined;
      this.cdRef.detectChanges();
    }, duration);
  }

  createAirport(IATA: string, city: string, airportName: string, nation: string) {
    this.http.post(this.us.url + '/airport', {
      IATA: IATA,
      city: city,
      airportName: airportName,
      nation: nation,
    }, this.us.createHeaders()).subscribe({
      next: (d) => {
        console.log('Airport inserted!');
        this.IATAText = '';
        this.cityText = '';
        this.airportNameText = '';
        this.selectedNation = '';
        this.airporterrmessage = undefined;
        this.showToast('Aereoporto inserito'); 
      },
      error: (err) => {
        console.log(err);
        this.airporterrmessage = err.error.errormessage;
      }
    });
  }

  createNation(nationName: string) {
    this.http.post(this.us.url + '/nation', {
      nationName: nationName,
    }, this.us.createHeaders()).subscribe({
      next: (d) => {
        console.log('Nation inserted!');
        this.nationNameText = '';
        this.nationerrmessage = undefined;
        this.getNations();
        this.showToast('Nazione inserita'); 
      },
      error: (err) => {
        console.log(err);
        this.nationerrmessage = err.error.errormessage;
      }
    });
  }


}
