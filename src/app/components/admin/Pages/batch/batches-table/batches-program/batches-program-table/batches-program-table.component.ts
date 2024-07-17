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
import { MatTableDataSource } from '@angular/material/table';
import { BatchProgramCoursesService } from 'src/app/components/shared/Services/batch-program-courses.service';
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

  programs: any[] = [];
  programCodes: string[] = [];
  students: any[] = [];

  programIdForChild!: number;
  batchPrograms: any[]=[];
  batchProgramCourses: any[]=[];
  selectedBatchProgramCourseId!: number;
  programCourses!: any[];
  dataSource!: MatTableDataSource<any>;


  constructor(
    private batchProgramService: BatchProgramsService,
    private batchProgramCourseService: BatchProgramCoursesService,
    private studentService: StudentTableService,
    private programService: ProgramsTableService,
    private _dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.getStudents();
    this.getPrograms();
    this.editBatchProgramReactiveForm = new FormGroup({
      programCode: new FormControl(null, Validators.required),
      programName: new FormControl(null, Validators.required),
      students: new FormControl(null, Validators.required),
    });
  }

  // while editing the entire student list should be visible
  getStudents() {
    this.studentService.getStudents().subscribe({
      next: (value) => {
        //console.log("students are: ",value)
        for (const obj of value) {
          //console.log("student object are: ",obj)
          this.students.push(obj);
        }
      },
    });
  }

  getPrograms() {
    this.programService.getPrograms().subscribe({
      next: (value) => {
        //console.log("programs are: ",value)
        for (const obj of value) {
          //console.log("program object are: ",obj)
          this.programs.push(obj);
          this.programCodes.push(obj.programCode);
        }
      },
    });
  }

  onProgramChange(event: any) {
    console.log("event got:",event);
    this.editBatchProgramReactiveForm.get('programCode')?.setValue(event.value.programCode);
  }

  // from parent
  @Input() batchId!: number;
  ngOnChanges(changes: SimpleChanges): void {
    //console.log("batch id changed:",this.batchId)
    if (changes['batchId'] && this.batchId) {
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
        //targetBatchCode_programs: this.batchCode,
        targetBatchProgramName: row.programName,
        targetBatchProgramCode: row.code,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteBatchProgramCourseProgram(row);
      }
    });
  }

  saveBatchProgram(row: any) {
    console.log("row here:",row)
    console.log("payload",this.editBatchProgramReactiveForm)
    this.batchProgramCourseService.updateBatchProgramCourse(row.batchProgramCourseId,this.editBatchProgramReactiveForm.value).subscribe({
      next: (value) => {
        console.log("updated batchProgram:",value)
      }
    })
    window.location.reload();
  }

  cancelEditing() {
    this.editingRowID = -1;
    this.editBatchProgramReactiveForm.reset();
  }

  getBatchPrograms() {
    this.batchProgramCourseService.getAllProgramsByBatch(this.batchId).subscribe({
      next: (value) => {
        //this.dataSource=value;
        this.dataSource = new MatTableDataSource(value); // Initialize the dataSource with the fetched value
        //this.getPrograms();

      },
      error: (err) => {
        console.error("Error fetching batch programs:", err);
      }
    });

    //console.log("All DataSource:",this.dataSource)
  }

  // getStudentsByBatchAndProgram(programId: number){
  //   let students;
  //   this.batchProgramCourseService.getAllStudentsByBatchAndProgram(this.batchId,programId).subscribe({
  //     next: (value) => {
  //      students= value;
  //     },
  //     error: (err) => {
  //       console.error("Error fetching batch programs students:", err);
  //     }
  //   });
  //   return students;
  // }

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
    console.log("row to be added:",row)
    this.expandedRowAdd = this.expandedRowAdd == row ? null : row;
    this.isAddClicked = !this.isAddClicked;
    this.programIdForChild = row.programId;
    this.programCourses=row.courses;
    this.batchId=row.batchId;
    this.selectedBatchProgramCourseId=row.batchProgramCourseId;
    this.getBatchPrograms;
    this.rowIndexForChild = i;
    //this.batchProgramCourseService.setBatchId(row.batchId)
  }
  toggleTable(row: any) {
    console.log("expand icon clicked")
    this.expandedRowTable = this.expandedRowTable == row ? null : row;
    this.isTableClicked = !this.isTableClicked;
    this.programIdForChild = row.programId;
    this.batchProgramCourseService.setProgramId(row.programId);
    //this.batchProgramCourseService.setBatchId(row.batchId)
  }

  recieveIsAddClicked(value: boolean) {
    this.expandedRowTable = null;
    this.expandedRowAdd = null;
    this.isAddClicked = value;
  }

  deleteBatchProgramCourseProgram(row: any){
    this.batchProgramCourseService.deleteBatchProgramCourseProgram(row.batchProgramCourseId).subscribe({
      next: (value) => {
        console.log("deleted batchProgramCourseProgram:",value)
        window.location.reload();
      }
    })
  }
}
