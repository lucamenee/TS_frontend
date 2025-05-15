import { afterNextRender, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from './my_types/User';
import { jwtDecode } from "jwt-decode";
import { Route } from '@angular/router';



interface TokenData {
    email: string,
    name: string,
    surname: string,
    username: string,
    role: string,
    _id: string,
}


interface RecievedToken {
    token: string
}

@Injectable()
export class UserHttpService {
    public url = 'http://localhost:1337';    
    private token: string = '';
    private isLoggedIn = false;

    constructor(private http: HttpClient, private ngZone: NgZone, public router: Router) {
        console.log('User service instantiated');

        // if (typeof window !== 'undefined' && localStorage) {
        //     const loadedToken = localStorage.getItem('tailwind_token');
        //     if (!loadedToken || loadedToken.length < 1) {
        //         console.log('No token found in local storage');
        //         this.token = '';
        //     } else {
        //         this.token = loadedToken as string;
        //         console.log('JWT loaded from local storage');
        //     }
        // }

        afterNextRender(() => {
            this.isLoggedIn = !!localStorage.getItem('tailwind_token');
            if (this.isLoggedIn){
                this.token = localStorage.getItem('tailwind_token') as string;
            }
        })

        // // Load the token from local storage when the service is initialized
        // afterNextRender(() => {
        //     const loadedToken = localStorage.getItem('tailwind_token');
        //     if (loadedToken) {
        //         this.token = loadedToken;
        //         this.isLoggedIn = true;
        //         console.log('JWT loaded from local storage:', this.token);
        //     } else {
        //         console.log('No token found in local storage');
        //     }
        
        // })
        
    }

    login(username: string, password: string): Observable<any> {
        console.log('Login: ' + username + ' ' + password );
        const options = {
            headers: new HttpHeaders({
                authorization: 'Basic ' + btoa( username + ':' + password),
                'cache-control': 'no-cache',
                'Content-Type':  'application/x-www-form-urlencoded',
            })
        }

        return this.http.get(this.url + '/login', options).pipe(
            tap((data) => {
                console.log("Data received when invoking the /login endpoint:")
                console.log(JSON.stringify(data));
                this.token = (data as RecievedToken).token;
                this.isLoggedIn = true;
                
                console.log("Saving token to localstorage");
                this.ngZone.run(() => {
                    localStorage.setItem('tailwind_token', this.token as string);                
                });
            })
        )
    }


    // logout() {
    //     console.log('Logging out');
    //     this.token = '';
    //     this.ngZone.run(() => {
    //         localStorage.setItem('tailwind_token', this.token);
    //     })
    // }

    logout() {
        // Clear the token and update login state
        this.ngZone.run(() => {
            localStorage.removeItem('tailwind_token');
        })
        this.isLoggedIn = false;
        this.token = '';
        this.router.navigate(['/login']);
    }


    register(username: string, name: string, password: string, email: string, role: string, surname: string): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                'cache-control': 'no-cache',
                'Content-Type':  'application/json',
                Authorization: 'Bearer ' + this.get_token()
            })
        };

        console.log(role)

        return this.http.post(this.url + '/register', {
            'name': name,
            'username': username,
            'surname': surname,
            'password': password,
            'email': email,
            'role': role,
        }, options);
    }

    get_token(): string {
        return this.token;
    }
    
    get_username(): string {
        return (jwtDecode(this.token) as TokenData).username;
    }

    get_mail(): string {
        return (jwtDecode(this.token) as TokenData).email;
    }

    get_id(): string {
        return (jwtDecode(this.token) as TokenData)._id;
    }
    
    get_name(): string {
        return (jwtDecode(this.token) as TokenData).name;
    }

    get_surname(): string {
        return (jwtDecode(this.token) as TokenData).surname;
    }

    get_role(): string {
        return (jwtDecode(this.token) as TokenData).role;
    }

    is_airline(): boolean {
        return (jwtDecode(this.token) as TokenData).role == 'AIRLINE';
    }
    
    is_passenger(): boolean {
        return (jwtDecode(this.token) as TokenData).role == 'PASSENGER';
    }
    
    is_admin(): boolean {
        return (jwtDecode(this.token) as TokenData).role == 'ADMIN';
    }

    is_logged(): boolean {
       return this.isLoggedIn;
    }




}