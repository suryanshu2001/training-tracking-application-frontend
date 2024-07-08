import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BatchServiceService {
  Index: string = 'http://localhost:3000/batches';
  constructor(private _http: HttpClient) {}

  addBatch(data: any): Observable<any> {
    return this._http.post(this.Index, data);
  }

  getBatches(): Observable<any> {
    return this._http.get(this.Index);
  }

  deleteBatch(id: string): Observable<any> {
    return this._http.delete(this.Index + '/' + id);
  }
}
