import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cat } from '../models/cat.model';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private apiUrl = 'https://66101e9b0640280f219c53ec.mockapi.io/api/v1/cats/cats';
  private premiumApiUrl = 'https://66101e9b0640280f219c53ec.mockapi.io/api/v1/cats/premium-cats';

  constructor(private http: HttpClient, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  getCats(page?: number, limit?: number): Observable<Cat[]> {
    let headers = new HttpHeaders();
    let apiUrl = this.apiUrl;

    if (isPlatformBrowser(this.platformId) && this.authService.isAuthenticated()) {
      apiUrl = this.premiumApiUrl;
      headers = headers.set('Authorization', `Bearer ${localStorage.getItem('clientToken')}`);
    }

    let params: any = {};
    if (page !== undefined && limit !== undefined) {
      params.page = page.toString();
      params.limit = limit.toString();
    }

    return this.http.get<Cat[]>(apiUrl, { headers, params }).pipe(
      catchError(this.handleError)
    );
  }

  getCat(id: string): Observable<Cat> {
    let apiUrl = this.apiUrl;
    if (isPlatformBrowser(this.platformId) && this.authService.isAuthenticated()) {
      apiUrl = this.premiumApiUrl;
    }

    return this.http.get<Cat>(`${apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`;
    } else {
      errorMessage = `${error.status} ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}