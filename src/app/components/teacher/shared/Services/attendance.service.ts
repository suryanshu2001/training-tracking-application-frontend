import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  Index1: string = 'http://localhost:5050/attendance';
  Index2: string = 'http://localhost:5050/attendance-student/update/attendence';
  Index3: string = 'http://localhost:5050/daily-topic-coverages';
  Index4: string = 'http://localhost:5050/batchProgramCourseTopics';

  attendance!: any;
  constructor(private _http: HttpClient) {}

  addAttendance(bpcId: number,date: string): Observable<any> {
    const data={
      batchProgramCourse:{batchProgramCourseId:bpcId},
     date:date
    }
    return this._http.post(this.Index1, data);
  }

  getAttendanceByDate(bpcId: number, date: string): Observable<any> {
    return this._http.get(`${this.Index1}/batch-program-course/${bpcId}/date/${date}`).pipe(
      catchError((error) => {
        // If the GET request fails, attempt to add attendance
        return this.addAttendance(bpcId, date).pipe(
          switchMap(() => {
            // After successfully adding attendance, retry the GET request
            return this._http.get(`${this.Index1}/batch-program-course/${bpcId}/date/${date}`);
          })
        );
      })
    );
  }

  updateAttendance(attendences:any): Observable<any> {
    return this._http.patch(this.Index2, attendences);
  }
  addTopic(data:any): Observable<any>{
    return this._http.post(`${this.Index3}`,data);
  }
  updateCourseCoverageOfTopic(data:any){
    return this._http.patch(`${this.Index4}`,data)
  }
}
