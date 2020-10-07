import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TermsService {

  constructor(private http: HttpClient) { }

  public getData(): Promise<any> {
    return this.http.get<any>("assets/sample2.json")
    .toPromise()
    .then(res => res);
  }
}
