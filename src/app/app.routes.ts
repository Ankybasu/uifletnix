import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DetailspageComponent } from './components/detailspage/detailspage.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
        { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default redirection
    //  { path: '**', redirectTo: '/home' }, // Wildcard route for 404
        {path:'search',component:SearchComponent},
        {path:'home',component:HomeComponent},
        { path: 'details/:show_id', component: DetailspageComponent },
        {path:'register',component:RegisterComponent},
        {path:'login',component:LoginComponent},
        { path: 'logout', component: LogoutComponent },
];
