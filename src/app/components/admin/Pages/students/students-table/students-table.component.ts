import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StudentTableService } from '../../../../shared/Services/student-table.service';
import { MatDialog } from '@angular/material/dialog';
import { StudentTableData } from '../../../shared/models/student-table.model';
import { DeleteDialogueComponent } from '../../../../shared/delete-dialogue/delete-dialogue.component';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
})
export class StudentsTableComponent implements OnInit, OnChanges {
  constructor(
    private studentService: StudentTableService,
    private _dialog: MatDialog
  ) {}
  editStudentReactiveForm!: FormGroup;
  editingRowID: number | null = null;
  courses: string[] = [];
  displayedColumns: string[] = [
    'actions',
    'studentCode',
    'studentName',
    'emailID',
  ];
  dataSource!: MatTableDataSource<StudentTableData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.editStudentReactiveForm = new FormGroup({
      studentCode: new FormControl(null, Validators.required),
      studentName: new FormControl(null, Validators.required),
      emailID: new FormControl(null, [Validators.required, Validators.email]),
    });
  }
  // Search Filter
  @Input() filterValue!: string;

  // Refresh
  @Input() $clickEvent!: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterValue']) {
      this.applyFilter(this.filterValue);
    }

    if (changes['$clickEvent']) {
      // console.log('REFRESHINGGGGGG');
      this.getStudents();
    }
  }

  applyFilter(filterValue: string) {
    // console.log(this.dataSource);
    if (this.dataSource) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  getStudents() {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  saveStudents(row: StudentTableData) {
    if (this.editStudentReactiveForm.valid) {
      this.studentService
        .editStudent(row.id, this.editStudentReactiveForm.value)
        .subscribe({
          next: (data) => {
            this.editingRowID = null;
            this.getStudents();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  editStudent(id: number, row: StudentTableData) {
    // console.log(row);
    this.editingRowID = id;
    this.editStudentReactiveForm.patchValue(row);
  }

  protected cancelEditing() {
    this.editingRowID = null;
    this.editStudentReactiveForm.reset();
  }

  protected deleteStudent(id: string, studentName: string) {
    const dialogRef = this._dialog.open(DeleteDialogueComponent, {
      data: { targetStudentName: studentName },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.studentService.deleteStudents(id).subscribe({
          next: (data) => {
            this.getStudents();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }
}
