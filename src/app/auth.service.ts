import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment, utc } from 'moment';
import { Subject, Observable } from 'rxjs';
import { shareReplay, tap } from "rxjs/operators";
import * as moment from 'moment';
import { environment } from './../environments/environment';
import { PouchDBService } from './pouchdb.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public changes: Subject<{ type: string }> = new Subject<{ type: string }>();

  constructor(private http: HttpClient, private dbservice: PouchDBService) {
    this.changes.subscribe(e => this.dbservice.authChange(e));
  }

  options(server: string): Observable<any[]> {
    if(environment.login_server) server = environment.login_server;
    let href = server + '/sphairas-login/options';
    let key: string = environment.login_key;
    let options = {
      params: {
        "login_key": key
      }
    };
    return this.http.get<any[]>(href, options)
      .pipe(
        shareReplay()
      );
  }

  login(server: string, account: string, password: string) {
    if(environment.login_server) server = environment.login_server;
    let href = server + '/sphairas-login/login';
    return this.http.post<{ db: string, api: string, jwt: string, exp: number }>(href, { account, password })
      .pipe(
        tap(res => this.setSession(res)),
        shareReplay()
      );
  }

  private setSession(res) {
    localStorage.setItem('id_token', res.jwt);
    localStorage.setItem("expires_at", res.exp);
    let change: { type: string } = { type: "login" }
    this.changes.next(change);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    let change: { type: string } = { type: "logout" }
    this.changes.next(change);
  }

  public isLoggedIn() {
    const expiration: number = +localStorage.getItem("expires_at");
    const expiresAt: Moment = moment(expiration);
    return utc().isBefore(expiresAt);
  }

}
