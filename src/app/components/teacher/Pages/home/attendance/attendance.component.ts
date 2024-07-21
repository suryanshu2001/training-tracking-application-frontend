import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { BatchServiceService } from 'src/app/components/shared/Services/batch-service.service';
import { BatchProgramsService } from 'src/app/components/shared/Services/batch-programs.service';
import { AttendanceTableComponent } from './attendance-table/attendance-table.component';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
} from '@angular/forms';
import { CourseTopicModel } from '../../../shared/models/CourseTopicModel';
import { BatchProgramCoursesService } from 'src/app/components/shared/Services/batch-program-courses.service';
import { BatchProgramCourseTopicService } from '../../../shared/Services/batch-program-course-topic.service';
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AttendanceTableComponent,
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  batches: any[] = [];
  batchId!: number;
  programs: any[] = [];
  programId!: number;
  courses: any[] = [];
  courseId!: number;
  bpcId!: number;
  selectedCourseTopic!: CourseTopicModel;
  batchProgramCourses!: any[];
  courseTopics: CourseTopicModel[]=[];
  filteredPrograms!: any[];
  filteredBatchProgramCourses!: any[];
  uniqueBatches!: any[];
  uniquePrograms!: any[];

  batchProgramReactiveForm!: FormGroup;

  // allows the opening of the table below
  enableTable: boolean = false;
  startDate: any;
  selectedDate: any;
  addTopicDropDown: boolean=false;
  constructor(
    // private batchService: BatchServiceService,
    private batchProgramService: BatchProgramsService,
    private batchProgramCourseService: BatchProgramCoursesService,
    private batchProgramCourseTopicService: BatchProgramCourseTopicService
  ) {}

  ngOnInit(): void {
    this.getBatcheProgramCourses();
    this.batchProgramReactiveForm = new FormGroup({
      batch: new FormControl(null, Validators.required),
      batchStartDate: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      program: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      course: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      date: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
    });
  }

  getBatches(){
    this.uniqueBatches = Array.from(new Set(this.batchProgramCourses.map(item => item.batch.batchId)))
    .map(batchId => this.batchProgramCourses.find(item => item.batch.batchId === batchId).batch);
  }

  getBatcheProgramCourses() {
    this.batchProgramCourseService.getBatchProgramCoursesByTeacher().subscribe({
      next: (data: any) => {
        this.batchProgramCourses = data;
        console.log("got batch program Courses:",this.batchProgramCourses)
        this.getBatches();
      }
    })
  }

  getBatchProgram(batchId: number) {
    this.batchProgramService.getBatchProgramByBatchId(batchId).subscribe({
      next: (data) => {
        // this.programs = data;
        for (const obj of data) {
          // console.log(obj);
          this.programs.length = 0;
          for (const batchProgram of obj.batchPrograms) {
            this.programs.push(batchProgram);
            // console.log(this.programs);
          }
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onBatchChange(event: any) {
    this.startDate=event.value.startDate;
    console.log("startDate:",this.startDate)
    this.filteredPrograms = this.batchProgramCourses.filter((item:any) => {
      return item.batch.batchId === event.value.batchId
    });
    console.log("filteredPrograms:",this.filteredPrograms)
    this.uniquePrograms = Array.from(new Set(this.filteredPrograms.map(item => item.program.programId)))
    .map(programId => this.batchProgramCourses.find(item => item.program.programId === programId).program);
    console.log("uniquePrograms:",this.uniquePrograms)
    this.batchProgramReactiveForm?.get('program')?.enable();
  }

  setCourseTopics(){
    for(const batchProgramCourse of this.filteredBatchProgramCourses){
      this.batchProgramCourseTopicService.getBatchProgramCourseTopicsByBatchProgramCourseId(batchProgramCourse.batchProgramCourseId).subscribe({
        next: (data: any) => {
          this.courseTopics=this.filterCourseTopic(data);
          console.log("course Topics",this.courseTopics)
          //this.dataSource= new MatTableDataSource(this.courseTopics)
        }
      })
    }

  }

  filterCourseTopic(data:any): CourseTopicModel[] {
    const courseMap = new Map<number, CourseTopicModel>();

    data.forEach((item:any) => {
      const course = item.batchProgramCourse.course;
      const bpcId = item.batchProgramCourse.batchProgramCourseId;
      const courseId = course.courseId;
      const courseCode = course.code;
      const batchProgramCourseTopicId = item.batchProgramCourseTopicId;
      console.log("item:",item)
      const topicName = item.topic.topicName;
      const topicId = item.topic.topicId;
      const percentageCompleted = item.percentageCompleted;

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          code: courseCode,
          bpcId:bpcId,
          courseId:courseId,
          courseName: course.courseName,
          topicsCompleted: [],
          topicsInProgress: [],
          totalTopics: 0,
          totalPercentage: 0,
          courseCompletionPercentage: 0
        });
      }

      const courseModel = courseMap.get(courseId)!;

        if (percentageCompleted === 100) {
            courseModel.topicsCompleted.push(topicName);
        } else {
            courseModel.topicsInProgress.push({
                topicId: topicId,
                topicName: topicName,
                percentageCompleted: percentageCompleted,
                batchProgramCourseTopicId: batchProgramCourseTopicId
            });
        }

        // Update total topics and total percentage
        courseModel.totalTopics++;
        courseModel.totalPercentage += percentageCompleted;
    });

    courseMap.forEach((courseModel) => {
      courseModel.courseCompletionPercentage = Math.round(courseModel.totalPercentage / courseModel.totalTopics);

  });

    return Array.from(courseMap.values());
  }

  onProgramChange(event: any) {
    this.filteredBatchProgramCourses = this.filteredPrograms.filter((item: any) =>{
      return item.program.programId === event.value.programId;
    })
    console.log("filtered after program:",this.filteredBatchProgramCourses)
    this.setCourseTopics();
    this.batchProgramReactiveForm?.get('course')?.enable();
  }

  onCourseChange(event: any) {
    this.batchProgramReactiveForm?.get('date')?.enable();
    this.selectedCourseTopic=event.value;
  }
  enableAddTopic: boolean = false;
  attendancePayload!: any;
  onDateChange(event:any) {
    this.selectedDate=event.value;
    this.sendPayloadToChild()
    this.batchProgramReactiveForm.disable()
  }

  sendPayloadToChild() {
    if (this.batchProgramReactiveForm.valid) {
      this.attendancePayload = {
        cto:this.selectedCourseTopic,
        date:this.selectedDate,
      }
      this.enableTable = true;
      this.enableAddTopic=true;
    }
    // console.log(this.attendancePayload);
    // console.log(this.enableTable);
  }

  addTopicClicked(){
    this.addTopicDropDown=true;
  }

  getTopicsInProgress(element: any): string {
    if (element.topicsInProgress && element.topicsInProgress.length > 0) {
      return element.topicsInProgress.map((topic:any) =>{return topic.topicName}).join(', ');
    }
    return 'NA';
  }
}
