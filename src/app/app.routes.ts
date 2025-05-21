import { Routes } from '@angular/router';
import { FlightSearch } from './flight-search/flight-search.component';
import { LoginComponent } from './login/login.component';
import { FlightDetail } from './flight-detail/flight-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './guard/admin.guard';
import { airlineGuard } from './guard/airline.guard';
import { AirlineComponent } from './airline/airline.component';
import { SignupComponent } from './signup/signup.component';
import { AircraftManagementComponent } from './aircraft-management/aircraft-management.component';
import { FlightManagementComponent } from './flight-management/flight-management.component';
import { StatisticsComponent } from './statistics/statistics.component';

export const routes: Routes = [
    { path: '', title: 'Home', component: FlightSearch },
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'signup', title: 'Sign-up', component: SignupComponent },
    { path: 'flight/:id', title: 'Dettagli volo', component: FlightDetail },
    { path: 'profile', title: 'Profilo', component: ProfileComponent },
    { path: 'airline', title: 'Dashboard', component: AirlineComponent, canActivate: [airlineGuard] },
    { path: 'airline/aircrafts', title: 'Gestione flotta', component: AircraftManagementComponent, canActivate: [airlineGuard] },
    { path: 'airline/flights', title: 'gestione voli', component: FlightManagementComponent, canActivate: [airlineGuard] },
    { path: 'airline/statistics', title: 'Statistiche', component: StatisticsComponent, canActivate: [airlineGuard] },
    { path: 'admin', title: 'Admin dashboard', component: AdminComponent, canActivate: [adminGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
