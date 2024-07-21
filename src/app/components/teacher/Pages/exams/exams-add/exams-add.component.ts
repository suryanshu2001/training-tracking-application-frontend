import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
  FormsModule,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ExamsService } from '../../../shared/Services/exams.service';
import { AssignmentService } from '../../../shared/Services/assignment.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exams-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './exams-add.component.html',
  styleUrls: ['./exams-add.component.scss'],
})
export class ExamsAddComponent {
  constructor(
    private examService: ExamsService,
    private assignmentService: AssignmentService
  ) {}

  @Input() openExamForm: boolean = false;
  @Input() parentPayload!: any;
  @Input() currentBPCId!: number;

  // reusing the component for assignments as well
  @Input() isAssignments: boolean = false;

  @Output() closeExamForm = new EventEmitter<boolean>();

  displayedColumns: string[] = [];

  setUpColumns() {
    if (this.isAssignments) {
      this.displayedColumns = [
        'actions',
        'evaluationName',
        'totalMarks',
        'submissionDate',
        'evaluationTime',
        'uploadFile',
      ];
    } else {
      this.displayedColumns = [
        'actions',
        'evaluationName',
        'totalMarks',
        'submissionDate',
        'evaluationTime',
        'uploadFile',
      ];
    }
  }

  sharedReactiveForm!: FormGroup;

  ngOnInit(): void {
    this.setUpColumns();
    // console.log(this.displayedColumns);
    this.sharedReactiveForm = new FormGroup({
      [this.isAssignments ? 'evaluationName' : 'evaluationName']: new FormControl(
        null,
        [
          Validators.required,
          Validators.pattern(/^[\S]+(\s+[\S]+)*$/), // regex for no whitespace
        ]
      ),
      totalMarks: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]+$/), // regex for numbers only
      ]),
      [this.isAssignments ? 'submissionDate' : 'submissionDate']: new FormControl(
        null,
        [Validators.required, Validators.pattern(/^[\S]+(\s+[\S]+)*$/)]
      ),
      [this.isAssignments ? 'evaluationTime' : 'evaluationTime']: new FormControl(
        null,
        [Validators.required, Validators.pattern(/^[\S]+(\s+[\S]+)*$/)]
      ),
      uploadFile: new FormControl(null),
    });
  }

  onSubmit() {
    console.log("cbpcid",this.currentBPCId)
    if (this.sharedReactiveForm.valid) {
      const examPayload = {
        ...this.sharedReactiveForm.value,
        ...this.parentPayload,
        batchProgramCourse:{batchProgramCourseId:this.currentBPCId},
        evaluationType: this.isAssignments ? 'assignment' : 'exam', // Adding evaluationType
      };
      console.log(examPayload);

      // conditionally check if we are in assignments or exams and make the service call
      const serviceMethod = this.isAssignments
        ? this.assignmentService.addAssignments(examPayload)
        : this.examService.addExams(examPayload);

      serviceMethod.subscribe({
        next: (res) => {
          this.sharedReactiveForm.reset();
          this.closeForm();
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  closeForm() {
    this.openExamForm = !this.openExamForm;
    this.closeExamForm.emit(this.openExamForm);
    this.sharedReactiveForm.reset();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file);
  }
}
