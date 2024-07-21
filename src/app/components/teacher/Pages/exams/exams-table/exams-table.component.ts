import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AssignmentService } from '../../../shared/Services/assignment.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from 'src/app/components/shared/delete-dialogue/delete-dialogue.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exams-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './exams-table.component.html',
  styleUrls: ['./exams-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ExamsTableComponent implements OnInit {
  constructor(
    private examService: ExamsService,
    private assignmentService: AssignmentService,
    private _dialog: MatDialog
  ) {}


  @Input() isAssignments: boolean = false;
  @Input() batchProgramCourseId: any;
  @Input() currentBPCId!: number;
  @Input() students!:any []

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

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;

  editingRowID: number = -1;

  // students: string[] = [];
  currentBatchProgramCourseId!: number;
  sharedReactiveForm!: FormGroup;
  sharedReactiveFormMarks!: FormGroup;

  ngOnInit(): void {
    this.setUpColumns();
    this.subscribeToBPCIdChanges();
    console.log("table bpcID:",this.batchProgramCourseId);

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


      this.sharedReactiveFormMarks = new FormGroup({
        studentName: new FormControl(null, [Validators.required, Validators.pattern(/^[\S]+(\s+[\S]+)*$/)]),
        marks: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentBPCId']) {
      this.loadData();
    }
  }

  loadData() {
    const serviceMethod = this.isAssignments
      ? this.assignmentService.getAssignments()
      : this.examService.getExams();

    serviceMethod.subscribe({
      next: (response) => {
        console.log("Filter Data in table : ",response.data);
        const filteredData = response.data.filter((item: any) => {
          return item.evaluationType === (this.isAssignments ? 'assignment' : 'exam') &&
                 item.batchProgramCourse?.batchProgramCourseId == this.currentBPCId;
        });
        this.dataSource = new MatTableDataSource(filteredData);
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

subscribeToBPCIdChanges() {
  const serviceMethod = this.isAssignments
      ? this.assignmentService.getAssignments()
      : this.examService.getExams();

    serviceMethod.subscribe({
      next: (response) => {
        // Filter data based on evaluationType
        const filteredData = response.data.filter((item: any) =>{
          console.log("item:::",item,this.currentBPCId)
          return item.evaluationType === (this.isAssignments ? 'assignment' : 'exam')
          &&item.batchProgramCourse?.batchProgramCourseId==this.currentBPCId
          }
        );
        this.dataSource = new MatTableDataSource(filteredData);
        this.dataSource.sort = this.sort;
        console.log("data source",this.dataSource)
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  editSharedData(evaluationId: number, row: any) {
    this.editingRowID = evaluationId;
    this.sharedReactiveForm.patchValue(row);
    console.log(this.currentBPCId);
  }

  deleteSharedData(row: any) {
    const dialogRef = this._dialog.open(DeleteDialogueComponent, {
      data: {
        targetType: this.isAssignments ? 'assignment' : 'exam',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const serviceMethod = this.isAssignments
          ? this.assignmentService.deleteAssignments(row.evaluationId)
          : this.examService.deleteExams(row.evaluationId);

        serviceMethod.subscribe({
          next: (data) => {
            this.subscribeToBPCIdChanges()
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  saveSharedData(row: any) {
    if (this.sharedReactiveForm.valid) {
      console.log("Save initiated :",this.currentBPCId)
      const serviceMethod = this.isAssignments
        ? this.assignmentService.editAssignments(
            row.evaluationId,
            {
              ...this.sharedReactiveForm.value,
              batchProgramCourse:{batchProgramCourseId:this.currentBPCId},
              evaluationType: 'assignment', // Adding evaluationType
            }
          )
        : this.examService.editExams(
            row.evaluationId,
            {
              ...this.sharedReactiveForm.value,
              batchProgramCourse:{batchProgramCourseId:this.currentBPCId},
              evaluationType: 'exam', // Adding evaluationType
            }
          );

      serviceMethod.subscribe({
        next: (data) => {
          this.cancelEditing();
          this.subscribeToBPCIdChanges();
          window.location.reload()
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  cancelEditing() {
    this.editingRowID = -1;
    this.sharedReactiveForm.reset();
  }

  expandedRowTable: any = null;
  isMarkStudentsClicked: boolean = false;

  toggleTable(row: any) {
    this.expandedRowTable = this.expandedRowTable == row ? null : row;
    this.isMarkStudentsClicked = !this.isMarkStudentsClicked;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // console.log(file);
  }

  onMarkSave(){
    // if (this.sharedReactiveFormMarks.valid) {
    //   const marksPayload = {
    //     ...this.sharedReactiveFormMarks.value.marks,
    //     // ...this.
    //     // ...this.parentPayload,
    //     // batchProgramCourse:{batchProgramCourseId:this.currentBPCId},
    //     evaluationType: this.isAssignments ? 'assignment' : 'exam', // Adding evaluationType
    //   };
    //   console.log(marksPayload);

    //   // conditionally check if we are in assignments or exams and make the service call
    //   const serviceMethod = this.isAssignments
    //     ? this.evaluationStudentsService.addEvaluationStudents(marksPayload)
    //     : this.evaluationStudentsService.addEvaluationStudents(marksPayload)

    //   serviceMethod.subscribe({
    //     next: (res) => {
    //       this.sharedReactiveFormMarks.reset();
    //       this.closeForm();
    //       // console.log(res);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   });
    // }
  }
  closeForm() {
    throw new Error('Method not implemented.');
  }
}
