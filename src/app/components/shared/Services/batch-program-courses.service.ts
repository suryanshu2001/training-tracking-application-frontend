import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BatchProgramCoursesService {
  Index: string = 'http://localhost:5050/batchProgramsCourses';
  batchCode!: string;
  constructor(private _http: HttpClient) {}

  setBatchCode(batchCode: string) {
    this.batchCode = batchCode;
  }

  getBatchCode() {
    return this.batchCode;
  }

  addBatchProgramCourses(data: any) {
    return this._http.post(this.Index, data);
  }

  getBatchProgramCourses(): Observable<any> {
    return this._http.get(this.Index);
  }

  getBatchProgramCoursesByID(batchProgramID: string): Observable<any> {
    return this._http.get(`${this.Index}?batchProgramID=${batchProgramID}`);
  }
}
