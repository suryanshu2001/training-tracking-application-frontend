import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { ProgramsTableService } from 'src/app/components/shared/Services/programs-table.service';
import { TeachersTableService } from 'src/app/components/shared/Services/teachers-table.service';
import { CourseTableDataService } from 'src/app/components/shared/Services/course-table-data.service';
import { BatchProgramsService } from 'src/app/components/shared/Services/batch-programs.service';
import { BatchProgramCoursesService } from 'src/app/components/shared/Services/batch-program-courses.service';
import { StudentTableService } from 'src/app/components/shared/Services/student-table.service';
@Component({
  selector: 'app-batches-program-courses-add',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './batches-program-courses-add.component.html',
  styleUrls: ['./batches-program-courses-add.component.scss'],
})
export class BatchesProgramCoursesAddComponent implements OnInit {
  addBatchProgramCoursesReactiveForm!: FormGroup;
  displayedColumns: string[] = ['actions', 'code', 'courseName', 'teacherName'];

  @Input() programId!: number;
  @Input() batchId!: number;
  @Input() rowIndex!: number;
  @Input() programCourses!: any[];
  @Input() selectedBatchProgramCourseId!: number;
  // this courses here is program specific
  courses: any[] = [];
  courseCode: string[] = [];
  enrolledCourses: any[]=[];
  teachers: any[] = [];
  currentBatchProgramCourse: any;

  selectedTeacherId!: number;
  selectedCourseId!: number;
  filteredData: any;
  store: any;
  arr2: any;
  constructor(
    private programService: ProgramsTableService,
    private teacherService: TeachersTableService,
    private courseService: CourseTableDataService,
    private studentService: StudentTableService,
    //private batchProgramService: BatchProgramsService,
    private batchProgramCoursesService: BatchProgramCoursesService
  ) {}

  ngOnInit(): void {
    this.getCourses();
    this.getBatchProgramCourses()
    this.getTeachers();
    this.addBatchProgramCoursesReactiveForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      teacher: new FormControl(null, Validators.required),
    });
  }

  // courses from a particular program
  getCourses() {
    // this.programService.getProgramById(this.programId).subscribe({
    //   next: (data) => {
    //     for (const course of data[0].courses) {
    //       this.courseService.getCoursesCodeByName(course).subscribe({
    //         next: (data) => {
    //           this.courses.push(data[0].course);
    //           this.courseCode.push(data[0].code);
    //         },
    //       });
    //     }
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
    //testing
    this.courses = this.programCourses;
  }

  getTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        for (const teacher of data) {
          this.teachers.push(teacher);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getStudents(){
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        for (const teacher of data) {
          this.teachers.push(teacher.teacherName);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getBatchProgramCourses() {
    this.batchId=this.batchProgramCoursesService.getBatchId();
    this.batchProgramCoursesService.getBatchProgramCourses().subscribe({
      next: (data) => {
        console.log("got course batchProgramCourse",data,"for program",this.programId);
        this.store=data;
        //filtering data for a particular batch
        this.filteredData= this.store.filter((obj: any)=>{
          return obj.program.programId==this.programId && obj.batch.batchId==this.batchId;
        })
        console.log("Filtered course data is:",this.filteredData)
        for(const pbc of this.filteredData){
            this.enrolledCourses.push(pbc.course);
        }
        this.arr2= this.enrolledCourses;

        this.courses = this.courses.filter(course => {
          console.log("course is:", course);
          console.log("arr2 is:", this.arr2);
          return !this.arr2.some((obj: any) => course.courseId === obj.courseId);
        });
      console.log("filtered course:",this.courses)
      },
    });
    //return filteredData;
  }

  onSubmit() {
    if (this.addBatchProgramCoursesReactiveForm.valid) {
      this.batchProgramCoursesService.getBatchProgramCourses().subscribe({
        next: (data) => {
          console.log("got course batchProgramCourse",data);
          const store: []=data;
          //filtering data for a particular batch
          const filteredData: any= store.filter((obj: any)=>{
            return obj.batchProgramCourseId==this.selectedBatchProgramCourseId;
          })
          this.currentBatchProgramCourse=filteredData;
          console.log("Filtered course data isss:",filteredData)
          if(filteredData[0].course == null){
            console.log("if got excecuted",this.currentBatchProgramCourse[0])
            const batchProgramCourseObject={
              batchProgramCourseId: this.selectedBatchProgramCourseId,
              course:{courseId:this.addBatchProgramCoursesReactiveForm.get("course")?.value.courseId},
              teacher:{teacherId:this.addBatchProgramCoursesReactiveForm.get("teacher")?.value.teacherId},
            }
            console.log("final object for put is:",batchProgramCourseObject)
          this.batchProgramCoursesService.updateBatchProgramCourse(this.selectedBatchProgramCourseId,batchProgramCourseObject).subscribe({
            next: (data) => {
              console.log("data is:",data);
              window.location.reload();
            }
          });
        }else{
          console.log("else got excecuted")
          const batchProgramCourseObject={
            //batchProgramCourseId: this.selectedBatchProgramCourseId,
            course:{courseId:this.addBatchProgramCoursesReactiveForm.get("course")?.value.courseId},
            teacher:{teacherId:this.addBatchProgramCoursesReactiveForm.get("teacher")?.value.teacherId},
            students:filteredData[0].students,
            batch:filteredData[0].batch,
            program:filteredData[0].program
          }
          console.log("final for post object is:",batchProgramCourseObject)
        this.batchProgramCoursesService.addBatchProgramCourses(batchProgramCourseObject).subscribe({
          next: (data) => {
            console.log("post data is:",data);
            window.location.reload();
          }
        });
        }
        },
      });
    }

  }

  onProgramChange(event: any) {
    const index = this.courses.indexOf(event.value);
    const code = this.courseCode[index];
    this.getBatchProgramCourses();
    this.addBatchProgramCoursesReactiveForm.get('code')?.setValue(code);
  }


  onCourseChange(event: any): void {
    const selectedCourse = event.value;
    console.log("selectedCourse",event.value)
    this.addBatchProgramCoursesReactiveForm.get('code')?.setValue(selectedCourse.code);
    this.teachers = selectedCourse.teachers;
    const teacherNameControl = this.addBatchProgramCoursesReactiveForm.get('teacherName');
    if (teacherNameControl) {
      teacherNameControl.reset();
    }
    console.log("teachers are:",this.teachers)
  }

  @Output() isAddClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  closeForm() {
    this.isAddClicked.emit(false);
    // console.log(this.isAddClicked);
  }
}
