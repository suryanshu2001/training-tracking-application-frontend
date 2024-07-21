import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  endpoint: string = 'http://localhost:5050/user';

  constructor(private _http: HttpClient) {}

  getUsers(): Observable<any> {
    return this._http.get(this.endpoint);
  }

  login(data: any): Observable<any> {
    return this._http.post(this.endpoint + '/login',data);
  }
}
