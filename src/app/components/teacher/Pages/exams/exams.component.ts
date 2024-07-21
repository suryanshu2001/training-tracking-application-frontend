import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import { BatchServiceService } from 'src/app/components/shared/Services/batch-service.service';
import { BatchProgramsService } from 'src/app/components/shared/Services/batch-programs.service';
import { CourseTableDataService } from 'src/app/components/shared/Services/course-table-data.service';

import { ExamsAddComponent } from './exams-add/exams-add.component';
import { ExamsTableComponent } from './exams-table/exams-table.component';
import { ExamsService } from '../../shared/Services/exams.service';
import { map, Observable } from 'rxjs';
@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ExamsAddComponent,
    ExamsTableComponent,
  ],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ExamsComponent implements OnInit, OnChanges {
  examReactiveForm!: FormGroup;
  batches: any[] = [];
  programs: any[] = [];
  courses: any[] = [];
  createExam: boolean = false;
  openExamForm: boolean = false;
  currentBPCId: number=0;

  @Input() isAssignments: boolean = false;
  batchProgramCourseId: any;
  students!: [];
  newBatches!: any[];
  filteredBatch: any;
  selectedBatch: any;

  constructor(
    private batchService: BatchServiceService,
    private batchProgramService: BatchProgramsService,
    private courseService: CourseTableDataService,
    private examService: ExamsService,

  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isAssignments']) {
      this.isAssignments = changes['isAssignments'].currentValue;
    }
  }

  ngOnInit(): void {
    this.getBatches();
    this.setupForm();
    this.getEvaluationStudents();
  }

  setupForm(): void {
    this.examReactiveForm = new FormGroup({
      batch: new FormControl(null, Validators.required),
      startDate: new FormControl({ value: null, disabled: true }, Validators.required),
      program: new FormControl({ value: null, disabled: true }, Validators.required),
      course: new FormControl({ value: null, disabled: true }, Validators.required),
    });
  }

  getBatches() {
    this.batchService.getBatches().subscribe({
      next: (data) => {
        this.batches = data;
        console.log('Batches:', data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getEvaluationStudents(){
    this.batchProgramService.getBatchProgram().subscribe({
      next: (response) => {
        this.newBatches = response;
        console.log('Students:', response);
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  getBatchPrograms(batchId: number) {
    this.batchProgramService.getBatchProgramByBatchId(batchId).subscribe({
      next: (data) => {
        this.programs = [];
        console.log("Batch Program Data:", data);

        if (Array.isArray(data.batchProgramCourses)) {
          const uniqueProgramCodes = new Set();

          for (const batchProgramCourse of data.batchProgramCourses) {
            if (batchProgramCourse.program && !uniqueProgramCodes.has(batchProgramCourse.program.programCode)) {
              this.programs.push(batchProgramCourse.program);
              uniqueProgramCodes.add(batchProgramCourse.program.programCode);
              console.log('Program:', batchProgramCourse.program);
            }
          }
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onBatchChange(event: any) {
    this.selectedBatch = this.batches.find(obj => obj.batchId === event.value);
    if (this.selectedBatch) {
      const startDate = this.selectedBatch.startDate;
      this.examReactiveForm?.get('program')?.enable();
      this.getBatchPrograms(this.selectedBatch.batchId);
      this.examReactiveForm.get('startDate')?.setValue(startDate);
    }
    console.log("the filtered batch is: ",this.selectedBatch);
  }

  onProgramChange(event: any) {
    this.courses.length = 0;
    const selectedProgramCode = event.value;
    console.log('Selected Program Code:', selectedProgramCode);

    const selectedProgram = this.programs.find(program => program.programCode === selectedProgramCode);

    if (selectedProgram) {
      console.log('Selected Program:', selectedProgram);
      this.getCoursesByProgramId(selectedProgram.programId);
    } else {
      console.error('Selected program not found in the programs array');
    }

    this.examReactiveForm?.get('course')?.enable();
  }

  getCoursesByProgramId(programId: number) {
    const selectedBatchId = this.examReactiveForm.get('batch')?.value;

    return this.batchProgramService.getBatchProgramByBatchId(selectedBatchId).pipe(
      map(data => {
        if (Array.isArray(data.batchProgramCourses)) {
          return data.batchProgramCourses
            .filter((bpc: { program: { programId: number; }; }) => bpc.program && bpc.program.programId === programId)
            .map((bpc: { course: any; batchProgramCourseId: any; }) => ({
              ...bpc.course,
              batchProgramCourseId: bpc.batchProgramCourseId
            }));
        }
        return [];
      })
    ).subscribe({
      next: (filteredCourses) => {
        this.courses = filteredCourses;
        console.log('Filtered courses:', this.courses);
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
  }

  onCourseChange(event: any) {
    this.currentBPCId = event.value.batchProgramCourseId;
    console.log("this bpc id",this.currentBPCId)
  }

  closeForm() {
    this.createExam = false;
    this.openExamForm = false;
    this.examReactiveForm.reset();
    this.examReactiveForm.enable();
    this.examReactiveForm?.get('startDate')?.disable();
  }

  parentPayload!: any;

  openForm() {
    if (this.examReactiveForm.valid) {
      this.examReactiveForm?.get('startDate')?.enable()
      this.parentPayload = {
        ...this.examReactiveForm.value,
      };
      this.openExamForm = !this.openExamForm;
      this.examReactiveForm.disable();
      this.createExam = false;
    }
  }

}
