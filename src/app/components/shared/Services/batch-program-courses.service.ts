import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BatchProgramCoursesService {
  Index: string = 'http://localhost:5050/batchProgramCourse';
  batchId!: number;
  programId!: number;
  constructor(private _http: HttpClient) {}

  setBatchId(batchId: number) {
    this.batchId = batchId;
    console.log("batchId updated:",this.batchId)
  }

  getBatchId() {
    return this.batchId;
  }

  setProgramId(programId: number){
    this.programId=programId;
  }

  getProgramId(){
    return this.programId;
  }

  addBatchProgramCourses(data: any) {
    return this._http.post(this.Index, data);
  }

  updateBatchProgramCourse(id: number,data:any){
    return this._http.put(this.Index+'/'+id,data);
  }

  updateBatchProgramCourseTeacher(id: number,data:any){
    return this._http.put(this.Index+'/teacher/'+id,data);
  }

  getBatchProgramCourses(): Observable<any> {
    return this._http.get(this.Index);
  }

  getBatchProgramCoursesByID(batchProgramID: number): Observable<any> {
    return this._http.get(`${this.Index}?batchProgramID=${batchProgramID}`);
  }

  getAllStudentsByBatchAndProgram(batchId: number,programId: number): Observable<any> {
    return this._http.get(`${this.Index}/students?batchId=${batchId}&programId=${programId}`)
  }

  getTeacherByBatchAndProgramCourse(batchId: number,programId: number,courseId: number): Observable<any> {
    return this._http.get(`${this.Index}/teacher?batchId=${batchId}&programId=${programId}&courseId=${courseId}`)
  }

  getAllProgramsByBatch(batchId: number): Observable<any> {
    return this._http.get(`http://localhost:5050/programs/batch/${batchId}`)
  }

  deleteBatchProgramCourse(id: number){
    return this._http.delete(`${this.Index}/${id}`)
  }

  deleteBatchProgramCourseProgram(id: number){
    return this._http.delete(`${this.Index}/program/${id}`);
  }

}
