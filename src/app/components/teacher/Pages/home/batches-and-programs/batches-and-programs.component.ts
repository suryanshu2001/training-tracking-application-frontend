import { CourseTopicModel } from './../../../shared/models/CourseTopicModel';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { BatchServiceService } from 'src/app/components/shared/Services/batch-service.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
} from '@angular/forms';
import { BatchProgramsService } from 'src/app/components/shared/Services/batch-programs.service';
import { BatchProgramCoursesService } from 'src/app/components/shared/Services/batch-program-courses.service';
import { BatchProgramCourseTopicService } from '../../../shared/Services/batch-program-course-topic.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-batches-and-programs',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './batches-and-programs.component.html',
  styleUrls: ['./batches-and-programs.component.scss'],
})
export class BatchesAndProgramsComponent implements OnInit {
  batches: any[] = [];
  batchId!: number;
  programs: any[] = [];
  programId!: number;
  batchProgramCourses!: any[];
  selectedCourseProgramTopic!: CourseTopicModel;
  courseTopics: CourseTopicModel[]=[];
  dataSource!: MatTableDataSource<CourseTopicModel>;
  displayedColumns: string[] = [
    'code',
    'courseName',
    'topicsCompleted',
    'topicsInProgress',
    'courseCompletionPercentage'
  ];

  batchProgramReactiveForm!: FormGroup;
  filteredPrograms!: any[];
  filteredBatchProgramCourses!: any[];
  uniqueBatches!: any[];
  uniquePrograms!: any[];
  startDate!: String;

  //displayedColumns: string[] = ['Code', 'CourseName', 'Topics Completed', 'Topics in progress','Course copmpletion percentage'];
  constructor(
    // private batchService: BatchServiceService,
    // private batchProgramService: BatchProgramsService,
    private batchProgramCourseService: BatchProgramCoursesService,
    private batchProgramCourseTopicService: BatchProgramCourseTopicService
  ) {}

  ngOnInit(): void {
    this.getBatcheProgramCourses();
    this.batchProgramReactiveForm = new FormGroup({
      batch: new FormControl(null, Validators.required),
      batchStartDate: new FormControl(null, Validators.required),
      program: new FormControl(null, Validators.required),
    });
    // console.log(this.batches);
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

  getBatches(){
    this.uniqueBatches = Array.from(new Set(this.batchProgramCourses.map(item => item.batch.batchId)))
    .map(batchId => this.batchProgramCourses.find(item => item.batch.batchId === batchId).batch);
  }


  onBatchChange(event: any) {
    this.startDate=event.value.startDate;
    console.log("startDate:",event)
    this.filteredPrograms = this.batchProgramCourses.filter((item:any) => {
      return item.batch.batchId === event.value.batchId
    });
    console.log("filteredPrograms:",this.filteredPrograms)
    this.uniquePrograms = Array.from(new Set(this.filteredPrograms.map(item => item.program.programId)))
    .map(programId => this.batchProgramCourses.find(item => item.program.programId === programId).program);
    console.log("uniquePrograms:",this.uniquePrograms)
  }

  onProgramChange(event: any) {
    this.filteredBatchProgramCourses = this.filteredPrograms.filter((item: any) =>{
      return item.program.programId === event.value.programId;
    })
    console.log("filtered after program:",this.filteredBatchProgramCourses)
    this.setCourseTopics();
  }

  setCourseTopics(){
    for(const batchProgramCourse of this.filteredBatchProgramCourses){
      this.batchProgramCourseTopicService.getBatchProgramCourseTopicsByBatchProgramCourseId(batchProgramCourse.batchProgramCourseId).subscribe({
        next: (data: any) => {
          this.courseTopics=this.filterCourseTopic(data);
          console.log("course Topics",this.courseTopics)
          this.dataSource= new MatTableDataSource(this.courseTopics)
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
      console.log("item:",item)
      const topicName = item.topic.topicName;
      const topicId = item.topic.topicId;
      const percentageCompleted = item.percentageCompleted;

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          code: courseCode,
          bpcId:bpcId,
          courseId: courseId,
          courseName: course.courseName,
          topicsCompleted: [],
          topicsInProgress: [],
          totalTopics:0,
          totalPercentage:0,
          courseCompletionPercentage: 0
        });
      }

      const courseModel = courseMap.get(courseId)!;

      if (percentageCompleted === 100) {
        courseModel.topicsCompleted.push(topicName);
      } else {
        courseModel.topicsInProgress.push({
          topicId:topicId,
          topicName:topicName,
          percentageCompleted:percentageCompleted
        });
      }

      // Update total topics and total percentage
      courseModel.totalTopics++;
      courseModel.totalPercentage += percentageCompleted;
    });

    courseMap.forEach((courseModel) => {
      courseModel.courseCompletionPercentage = Math.round(courseModel.totalPercentage / courseModel.totalTopics);
      // Remove temporary properties
      //delete courseModel.totalTopics;
      //delete courseModel.totalPercentage;
  });

    return Array.from(courseMap.values());
  }

  getTopicsInProgress(element: any): string {
    if (element.topicsInProgress && element.topicsInProgress.length > 0) {
      return element.topicsInProgress.map((topic:any) =>{return topic.topicName}).join(', ');
    }
    return 'NA';
  }
}
