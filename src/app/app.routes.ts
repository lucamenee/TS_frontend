import { Routes } from '@angular/router';
import { FlightSearch } from './flight-search/flight-search.component';
import { LoginComponent } from './login/login.component';
import { FlightDetail } from './flight-detail/flight-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './guard/admin.guard';

export const routes: Routes = [
    { path: '', title: 'Home', component: FlightSearch },
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'flight/:id', title: 'Dettagli volo', component: FlightDetail },
    { path: 'profile', title: 'Profilo', component: ProfileComponent },
    // { path: 'airline', title: 'Dashboard', component: AirlineComponent },
    { path: 'admin', title: 'Admin dashboard', component: AdminComponent, canActivate: [adminGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
