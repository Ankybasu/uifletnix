import { Routes } from '@angular/router';
import { DetailspageComponent } from './components/detailspage/detailspage.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default redirection
    { path: '**', redirectTo: '/home' }, // Wildcard route for 404
    {path:'search',component:SearchComponent},
    {path:'home',component:HomeComponent},
    { path: 'details/:show_id', component: DetailspageComponent },
];
