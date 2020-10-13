import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BaseTargetDocument } from './lessons/base-target-document';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor(private http: HttpClient) {
  }

  public getCourses(): Observable<BaseTargetDocument[]> {
    let settings: { db: string, api: string, account: string } = JSON.parse(localStorage.getItem('app-settings')) || {};
    if (!settings.api) return; //http://localhost:8080/clients
    let httpOptions = {
      params: new HttpParams().set('group', 'true'),
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };
    let auth = localStorage.getItem('id_token');
    if (auth) httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${auth}`);
    return this.http.get<any>(`${settings.api}/documents/targets`, httpOptions)
      .pipe(tap(response => {
        catchError(this.handleError),
          console.log(JSON.stringify(response));
      }));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
