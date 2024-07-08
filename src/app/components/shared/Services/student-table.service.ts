import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentTableService {
  Index: string = 'http://localhost:3000/students';

  constructor(private _http: HttpClient) {}

  addStudent(data: any): Observable<any> {
    return this._http.post(`${this.Index}`, data);
  }

  getStudents(): Observable<any> {
    return this._http.get(`${this.Index}`);
  }

  editStudent(id: string, data: any): Observable<any> {
    return this._http.patch(`${this.Index}/${id}`, data);
  }

  deleteStudents(id: string): Observable<any> {
    return this._http.delete(`${this.Index}/${id}`);
  }
}
