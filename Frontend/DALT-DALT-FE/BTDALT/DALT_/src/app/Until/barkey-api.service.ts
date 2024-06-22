import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BarkeyApiService {
  private baseUrl = 'https://4jjl5xvc-5000.asse.devtunnels.ms'; // Base URL cho API backend

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ message: string; username: string; status: string }> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<{ message: string; username: string; status: string }>(url, { username, password })
      .pipe(
        catchError((error) => {
          console.error('Error logging in:', error);
          return throwError(error);
        })
      );
  }

  register(username: string, password: string, phoneNumber: string, email: string): Observable<any> {
    const url = `${this.baseUrl}/register`;
    const body = { username, password, phoneNumber, email };
    return this.http.post(url, body)
      .pipe(
        catchError((error) => {
          console.error('Error registering:', error);
          return throwError(error);
        })
      );
  }
}
