import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl ="http://localhost:3000/auth";//local
  //'https://flet-nix-back-end.vercel.app/auth'; 
  private loggedIn = new BehaviorSubject<boolean>(this.isTokenAvailable());

  isLoggedIn = this.loggedIn.asObservable();
  constructor(private http: HttpClient) {}

  // Register User
  register(email: string, password: string, age: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { email, password, age });
  }

  // Login User
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  private isTokenAvailable(): boolean {
    return !!localStorage.getItem('token');
  }
  
}
