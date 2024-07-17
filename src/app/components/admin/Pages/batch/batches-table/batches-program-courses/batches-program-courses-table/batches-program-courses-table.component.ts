import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
} from '@angular/forms';
import { BatchProgramCoursesService } from 'src/app/components/shared/Services/batch-program-courses.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-batches-program-courses-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './batches-program-courses-table.component.html',
  styleUrls: ['./batches-program-courses-table.component.scss'],
})
export class BatchesProgramCoursesTableComponent implements OnInit {
  editBatchProgramCoursesReactiveForm!: FormGroup;

  dataSource!: MatTableDataSource<any>;
  filteredDataSource: any[]=[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['actions', 'code', 'courseName', 'teacherName'];

  editingRowID: number | null = null;
  //courses: any[]=[];
  filteredData: any[]=[];
  batchId!: number;
  programId!: number;
  code!: string;
  batchProgramCourseObject: any;

  constructor(private batchProgramCoursesService: BatchProgramCoursesService) {}

  ngOnInit(): void {
    this.getBatchProgramCourses();
    this.editBatchProgramCoursesReactiveForm = new FormGroup({
      code: new FormControl({value:null, disable:true}),
      courseName: new FormControl(null, Validators.required),
      teacherName: new FormControl(null, Validators.required),
    });
  }

  getBatchProgramCourses() {
    this.batchId=this.batchProgramCoursesService.getBatchId();
    this.programId=this.batchProgramCoursesService.getProgramId();
    console.log("initiated")
    this.batchProgramCoursesService.getBatchProgramCourses().subscribe({
      next: (data) => {
        console.log("got batchProgramCourse",data);
        const store: []=data;
        this.filteredData = store.filter((obj: any)=>{
          return obj.batch.batchId==this.batchId && obj.program.programId==this.programId;
        })
        console.log("Filtered data is:",this.filteredData,"for",this.batchId)
        for(const bpc of this.filteredData){
          console.log("obj bpc:",bpc)
          if(bpc.course!=null){
          //this.courses.push(bpc.course);
          this.filteredDataSource.push(bpc)
          }
        }
        //console.log("updated courses:",this.courses)
        this.dataSource = new MatTableDataSource(this.filteredDataSource)
        console.log("updated object:",this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
    });
  }

  saveBatchProgramCourse(row: any) {
    this.batchProgramCourseObject={
      teacher:{
        teacherId:this.editBatchProgramCoursesReactiveForm.get("teacherName")?.value.teacherId
      },
    }
    this.batchProgramCoursesService.updateBatchProgramCourseTeacher(row.batchProgramCourseId,this.batchProgramCourseObject).subscribe({
      next: (value) => {
        console.log("updated batchProgramCourse:",value)
        window.location.reload();
      }
    })

  }

  deleteBatchProgramCourse(row: any) {
    this.batchProgramCoursesService.deleteBatchProgramCourse(row.batchProgramCourseId).subscribe({
      next: (value) => {
        console.log("deleted batchProgramCourse:",value)
        window.location.reload();
      }
    })
  }

  editBatchProgramCourse(id: number, row:any) {
    console.log("course to be edited:",row.course)
    this.editingRowID = id;
    this.code=row
    this.editBatchProgramCoursesReactiveForm.patchValue(row.course);
  }
  cancelEditing() {}
}
