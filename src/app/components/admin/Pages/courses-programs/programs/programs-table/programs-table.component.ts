import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
  FormsModule,
} from '@angular/forms';
import { ProgramsTableService } from 'src/app/components/shared/Services/programs-table.service';
import { DeleteDialogueComponent } from '../../../../../shared/delete-dialogue/delete-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { TopicsData } from 'src/app/components/admin/shared/models/topics-table.model';
import { MatTableDataSource } from '@angular/material/table';
import { CourseTableDataService } from 'src/app/components/shared/Services/course-table-data.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProgramsTable } from 'src/app/components/admin/shared/models/programs-table.model';
@Component({
  selector: 'app-programs-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './programs-table.component.html',
  styleUrls: ['./programs-table.component.scss'],
})
export class ProgramsTableComponent {
  constructor(
    private programService: ProgramsTableService,
    private _dialog: MatDialog,
    private coursesService: CourseTableDataService
  ) {}

  protected editingRowID: number | null = null;

  protected isDescOpen: boolean = false;

  protected editProgramsReactiveForm!: FormGroup;

  dataSource!: MatTableDataSource<ProgramsTable>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = [
    'actions',
    'code',
    'programName',
    'theoryTime',
    'practiceTime',
    'description',
    'courses',
  ];

  protected courses: any[] = [];

  ngOnInit(): void {
    this.getProgramsList();

    this.coursesService.getCourses().subscribe({
      next: (data: any) => {
        for (const course of data) {
          this.courses.push(course);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.editProgramsReactiveForm = new FormGroup({
      programCode: new FormControl(null, Validators.required),
      programName: new FormControl(null, Validators.required),
      theoryTime: new FormControl(null, Validators.required),
      practiceTime: new FormControl(null, Validators.required),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(40),
      ]),
      courses: new FormControl(null, Validators.required),
    });
  }

  getProgramsList() {
    this.programService.getPrograms().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editPrograms(id: number, row: TopicsData) {
    this.editingRowID = id;
    this.editProgramsReactiveForm.patchValue(row);
    console.log(this.editProgramsReactiveForm.value);
  }

  deletePrograms(id: string, code: string, programName: string) {
    const dialogRef = this._dialog.open(DeleteDialogueComponent, {
      data: { targetProgramCode: code, targetProgramName: programName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.programService.deleteProgram(id).subscribe({
          next: (data) => {
            this.getProgramsList();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  savePrograms(id: number) {
    if (this.editProgramsReactiveForm.valid) {
      this.programService
        .editProgram(id, this.editProgramsReactiveForm.value)
        .subscribe({
          next: (data) => {
            this.cancelEditing();
            this.getProgramsList();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  cancelEditing() {
    this.editingRowID = null;
  }

  lettersTypedDesc: number = 0;
  onInputChange(event: any) {
    this.lettersTypedDesc = event.target.value.length;
  }

  getRemainingCoursesWithNumbers(courses: string[]): string {
    const remainingCourses = courses.slice(2);
    const numberedCourses = remainingCourses.map(
      (course, index) => `${index + 1}.${course}\n`
    );
    return numberedCourses.join(''); // Join with a newline character
  }
}
