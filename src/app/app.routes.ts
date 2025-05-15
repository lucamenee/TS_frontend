import { Routes } from '@angular/router';
import { FlightSearch } from './flight-search/flight-search.component';
import { LoginComponent } from './login/login.component';
import { FlightDetail } from './flight-detail/flight-detail.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', component: FlightSearch },
    { path: 'login', component: LoginComponent },
    { path: 'flight/:id', component: FlightDetail },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
