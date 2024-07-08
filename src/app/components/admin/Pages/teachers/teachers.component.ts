import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
  FormsModule,
} from '@angular/forms';
import { CourseTableDataService } from '../../../shared/Services/course-table-data.service';
import { TeachersTableService } from '../../../shared/Services/teachers-table.service';
import { TeachersTableComponent } from './teachers-table/teachers-table.component';
import { TeachersTableData } from '../../shared/models/teachers-table.model';
@Component({
  selector: 'app-teachers',
  standalone: true,
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    TeachersTableComponent,
    FormsModule,
  ],
})
export class TeachersComponent implements OnInit {
  constructor(
    private courseTableData: CourseTableDataService,
    private teacherService: TeachersTableService
  ) {}

  protected isAddTeacherClicked: boolean = false;
  protected addTeacherReactiveForm!: FormGroup;

  displayedColumns: string[] = [
    'actions',
    'teacherName',
    'courseAssigned',
    'emailID',
  ];

  courses: string[] = [];
  ngOnInit(): void {
    this.courseTableData.getCourses().subscribe({
      next: (data) => {
        for (const obj of data) {
          this.courses.push(obj.course);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.addTeacherReactiveForm = new FormGroup({
      teacherName: new FormControl(null, Validators.required),
      courseAssigned: new FormControl(null, Validators.required),
      emailID: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  protected onSubmit() {
    if (this.addTeacherReactiveForm.valid) {
      this.teacherService
        .addTeachers(this.addTeacherReactiveForm.value)
        .subscribe({
          next: () => {
            this.isAddTeacherClicked = !this.isAddTeacherClicked;
            this.addTeacherReactiveForm.reset();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  protected closeForm() {
    this.addTeacherReactiveForm.reset();
    this.isAddTeacherClicked = !this.isAddTeacherClicked;
  }

  // Refresh
  $clickEvent!: any;
  refresh($event: any) {
    this.$clickEvent = $event;
    // console.log('parent clicked');
  }

  // Search Filter
  SearchValue: string = '';
  onSearchChange(event: any) {
    this.SearchValue = (event.target as HTMLInputElement).value;
  }
}
