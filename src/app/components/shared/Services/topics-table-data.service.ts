import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TopicsTableDataService {
  constructor(private _http: HttpClient) {}

  Index: string = 'http://localhost:5050/topics';

  getTopicByCourseId(courseId: number): Observable<any[]> {
    return this._http.get<any[]>(this.Index + '/course/' + courseId);
  }

  addTopics(courseId: any, data: any): Observable<any> {
    data={...data,course:{courseId:courseId}}
    return this._http.post<any>(this.Index, data);
  }

  editTopics(topicId: number, data: any): Observable<any> {
    return this._http.put<any>(this.Index + `/${topicId}`, data);
  }

  deleteTopics(topicId: number): Observable<any> {
    return this._http.delete(`${this.Index}/${topicId}`);
  }

  uploadTopicFiles(topicId: number, files: File[], uploadedBy: string): Observable<any> {
    const url = `${this.Index}/${topicId}/files?uploadedBy=${uploadedBy}`;
    console.log("Files to be uploaded:", topicId, files, uploadedBy);

    // Create FormData object
    const formData = new FormData();

    // Append each file to FormData
    files.forEach((file, index) => {
      formData.append('files', file, file.name);
    });

    console.log("Form data:", formData);

    // Send POST request with form data
    return this._http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
