import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProgramsTable } from '../../admin/shared/models/programs-table.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgramsTableService {
  constructor(private _http: HttpClient) {}

  Index: string = 'http://localhost:5050/programs';

  addPrograms(data: ProgramsTable) {
    return this._http.post(this.Index, data);
  }

  getPrograms(): Observable<any> {
    return this._http.get(this.Index);
  }

  editProgram(id: number, data: any) {
    return this._http.put(`${this.Index}/${id}`, data);
  }
  deleteProgram(id: string) {
    return this._http.delete(`${this.Index}/${id}`);
  }

  getProgramById(programId: number): Observable<any> {
    return this._http.get(`${this.Index}/${programId}`);
  }
}
