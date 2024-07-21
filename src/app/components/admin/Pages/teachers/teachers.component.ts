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
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private teacherService: TeachersTableService,
    private snackBar: MatSnackBar
  ) {}

  protected isAddTeacherClicked: boolean = false;
  protected addTeacherReactiveForm!: FormGroup;

  displayedColumns: string[] = [
    'actions',
    'teacherName',
    'courseAssigned',
    'emailID',
  ];

  courses: any[] = [];
  ngOnInit(): void {
    this.courseTableData.getCourses().subscribe({
      next: (data) => {
        for (const course of data) {
          this.courses.push(course);
        }
      },
      error: (err) => {
        console.log(err);
      },

    });
    console.log("Courses : ",this.courses)
    this.addTeacherReactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      courses: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  protected onSubmit() {
    if (this.addTeacherReactiveForm.valid) {
      this.addBackgroundBlur();

      const sendingSnackBar = this.snackBar.open('Sending...', '', {
        duration: undefined,
      });

      this.teacherService
        .addTeachers(this.addTeacherReactiveForm.value)
        .subscribe({
          next: () => {
            sendingSnackBar.dismiss();
            this.snackBar.open('Email sent', 'Close', {
              duration: 1000,
            }).afterDismissed().subscribe(() => {
              this.removeBackgroundBlur();
              this.isAddTeacherClicked = false; // Hide the add teacher form
              this.addTeacherReactiveForm.reset();
              this.refreshTeachersTable(); // Refresh the teachers table
            });
          },
          error: (err) => {
            sendingSnackBar.dismiss();
            this.snackBar.open('Error sending email', 'Close', {
              duration: 1000,
            }).afterDismissed().subscribe(() => {
              this.removeBackgroundBlur();
            });
            console.log(err);
          },
        });
    }
  }

  // Add this new method to refresh the teachers table
  private refreshTeachersTable() {
    // Trigger the refresh event
    window.location.reload();
  }

  private addBackgroundBlur() {
    const blurOverlay = document.querySelector('.blur-overlay') as HTMLElement;
    if (blurOverlay) {
      blurOverlay.style.display = 'block';
    }
  }

  private removeBackgroundBlur() {
    const blurOverlay = document.querySelector('.blur-overlay') as HTMLElement;
    if (blurOverlay) {
      blurOverlay.style.display = 'none';
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
