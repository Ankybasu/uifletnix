import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl =
  //"http://localhost:3000/data";//local
   'https://flet-nix-back-end.vercel.app/data'; 
  constructor(private http: HttpClient) {}

  // Fetch paginated and filtered data
  getData(page: number = 1, limit: number = 15, type?: string, age?: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (type) params = params.set('type', type);
    if (age !== undefined) params = params.set('age', age);

    return this.http.get(`${this.baseUrl}`, { params });
  }

  // Search for items
  search(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get(`${this.baseUrl}/search`, { params });
  }

  // Get details for a specific show by ID
  getShowDetails(showId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${showId}`);
  }
  
}
