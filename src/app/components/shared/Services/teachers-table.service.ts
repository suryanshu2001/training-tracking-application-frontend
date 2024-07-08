import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeachersTableData } from '../../admin/shared/models/teachers-table.model';

@Injectable({
  providedIn: 'root',
})
export class TeachersTableService {
  Index: string = 'http://localhost:3000/teachers';
  constructor(private _http: HttpClient) {}

  getTeachers(): Observable<any> {
    return this._http.get(this.Index);
  }

  addTeachers(data: TeachersTableData) {
    return this._http.post(this.Index, data);
  }

  editTeachers(id: string, data: any) {
    return this._http.patch(this.Index + '/' + id, data);
  }

  deleteTeachers(id: string) {
    return this._http.delete(this.Index + '/' + id);
  }
}
