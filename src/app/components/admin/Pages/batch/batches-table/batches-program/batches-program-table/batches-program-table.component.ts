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
import { BatchProgramsService } from 'src/app/components/shared/Services/batch-programs.service';
import { StudentTableService } from 'src/app/components/shared/Services/student-table.service';
import { ProgramsTableService } from 'src/app/components/shared/Services/programs-table.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from 'src/app/components/shared/delete-dialogue/delete-dialogue.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BatchesProgramCoursesAddComponent } from '../../batches-program-courses/batches-program-courses-add/batches-program-courses-add.component';
import { BatchesProgramCoursesTableComponent } from '../../batches-program-courses/batches-program-courses-table/batches-program-courses-table.component';
@Component({
  selector: 'app-batches-program-table',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    BatchesProgramCoursesTableComponent,
    BatchesProgramCoursesAddComponent,
  ],
  templateUrl: './batches-program-table.component.html',
  styleUrls: ['./batches-program-table.component.scss'],
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
export class BatchesProgramTableComponent implements OnInit, OnChanges {
  editBatchProgramReactiveForm!: FormGroup;
  editingRowID: number = -1;
  displayedColumns: string[] = ['actions', 'code', 'programName', 'students'];

  programNames: string[] = [];
  programCodes: string[] = [];
  students: string[] = [];

  programCodeForChild!: string;

  dataSource!: any;

  constructor(
    private batchProgramService: BatchProgramsService,
    private studentService: StudentTableService,
    private programService: ProgramsTableService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getStudents();
    this.getPrograms();
    this.editBatchProgramReactiveForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      programName: new FormControl(null, Validators.required),
      students: new FormControl(null, Validators.required),
    });
  }

  // while editing the entire student list should be visible
  getStudents() {
    this.studentService.getStudents().subscribe({
      next: (value) => {
        for (const obj of value) {
          this.students.push(obj.studentName);
        }
      },
    });
  }

  getPrograms() {
    this.programService.getPrograms().subscribe({
      next: (value) => {
        for (const obj of value) {
          this.programNames.push(obj.programName);
          this.programCodes.push(obj.code);
        }
      },
    });
  }

  onProgramChange(event: any) {
    const index = this.programNames.indexOf(event.value);
    const code = this.programCodes[index];
    this.editBatchProgramReactiveForm.get('code')?.setValue(code);
  }

  // from parent
  @Input() batchCode: string = '';
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['batchCode'] && this.batchCode) {
      this.getBatchPrograms();
    }
  }

  editBatchProgram(id: number, row: any) {
    this.editingRowID = id;

    this.editBatchProgramReactiveForm.patchValue(row);
  }

  deleteBatchProgram(row: any) {
    const dialogRef = this._dialog.open(DeleteDialogueComponent, {
      data: {
        targetBatchCode_programs: this.batchCode,
        targetBatchProgramName: row.programName,
        targetBatchProgramCode: row.code,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.batchProgramService
          .getBatchProgramByBatchCode(this.batchCode)
          .subscribe({
            next: (value) => {
              value[0].batchPrograms = value[0].batchPrograms.filter(
                (obj: any) => obj.id != row.id
              );
              // console.log(row);
              // console.log(value[0].id);
              // console.log(value[0]);
              this.batchProgramService
                .updateBatchProgram(value[0].id, value[0])
                .subscribe({
                  next: () => {
                    console.log('DELETED');
                    this.getBatchPrograms();
                  },
                });
            },
          });
      }
    });
  }

  saveBatchProgram(row: any) {}

  cancelEditing() {
    this.editingRowID = -1;
    this.editBatchProgramReactiveForm.reset();
  }

  getBatchPrograms() {
    this.batchProgramService
      .getBatchProgramByBatchCode(this.batchCode)
      .subscribe({
        next: (value) => {
          for (const obj of value) {
            console.log(obj.batchPrograms);
            this.dataSource = obj.batchPrograms;
          }
        },
      });
  }
  getRemainingStudentsWithNumbers(students: string[]): string {
    const remainingStudent = students.slice(2);
    const numberedStudents = remainingStudent.map(
      (student, index) => `${index + 1}.${student}`
    );
    return numberedStudents.join('\n'); // Join with a newline character
  }

  isAddClicked: boolean = false;
  isTableClicked: boolean = false;

  expandedRowAdd!: any;
  expandedRowTable!: any;

  rowIndexForChild!: number;

  toggleAdd(row: any, i: number) {
    this.expandedRowAdd = this.expandedRowAdd == row ? null : row;
    this.isAddClicked = !this.isAddClicked;
    this.programCodeForChild = row.code;
    this.rowIndexForChild = i;
  }
  toggleTable(row: any) {
    this.expandedRowTable = this.expandedRowTable == row ? null : row;
    this.isTableClicked = !this.isTableClicked;
    this.programCodeForChild = row.code;
  }

  recieveIsAddClicked(value: boolean) {
    this.expandedRowTable = null;
    this.expandedRowAdd = null;

    this.isAddClicked = value;
  }
}
