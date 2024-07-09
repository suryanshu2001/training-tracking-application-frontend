import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableData } from '../../admin/shared/models/courses-table.model';

@Injectable({
  providedIn: 'root',
})
export class CourseTableDataService {
  constructor(private _http: HttpClient) {}

  Index: string = 'http://localhost:5050/courses';

  addCourse(data: TableData): Observable<any> {
    return this._http.post(`${this.Index}`, data);
  }

  getCourses(): Observable<any> {
    return this._http.get(`${this.Index}`);
  }

  getCoursesCodeByName(name: string): Observable<any> {
    return this._http.get(`${this.Index}?course=${name}`);
  }

  deleteCourses(id: string): Observable<any> {
    return this._http.delete(`${this.Index}/${id}`);
  }

  editCourses(id: string, data: TableData): Observable<any> {
    return this._http.put(`${this.Index}/${id}`, data);
  }
}
