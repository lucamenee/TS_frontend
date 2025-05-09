import { Routes } from '@angular/router';
import { FlightSearch } from './flight-search/flight-search.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: FlightSearch},
    { path: 'login', component: LoginComponent},
];
