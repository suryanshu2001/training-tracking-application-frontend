import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchProgramCourseTopicService {
  endpoint = 'http://localhost:5050/batchProgramCourseTopics';
  constructor(private _http: HttpClient) { }

  getBatchProgramCourseTopicsByBatchProgramCourseId(id: number): Observable<any>{
    return this._http.get(this.endpoint + '/batchProgramCourse/' + id);
  }

}
