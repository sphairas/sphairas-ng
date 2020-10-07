import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor(private http: HttpClient) {
  }

  public getCourses(): Observable<any> {
    return this.http.get<any>("assets/sample-courses.json")
      .pipe(map(response => {
        return response.courses;
      }));
  }
}
