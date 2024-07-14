import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentTableService {
  Index: string = 'http://localhost:5050/students';

  constructor(private _http: HttpClient) {}

  addStudent(data: any): Observable<any> {
    return this._http.post(`${this.Index}`, data);
  }

  getStudents(): Observable<any> {
    return this._http.get(`${this.Index}`);
  }

  editStudent(id:number,data: any): Observable<any> {
    return this._http.put(`${this.Index}/${id}`, data);
  }

  deleteStudents(id: number): Observable<any> {
    return this._http.delete(`${this.Index}/${id}`);
  }
}
