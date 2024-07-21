import { Component } from '@angular/core';
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
import { CourseTableDataService } from '../../../shared/Services/course-table-data.service';
import { StudentTableService } from '../../../shared/Services/student-table.service';
import { StudentsTableComponent } from './students-table/students-table.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    StudentsTableComponent,
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {
  constructor(
    private studentService: StudentTableService,
    private snackBar : MatSnackBar
    ) {}

  isAddStudentClicked: boolean = false;
  addStudentReactiveForm!: FormGroup;
  displayedColumns: string[] = [
    'actions',
    'studentCode',
    'name',
    'email',
  ];

  ngOnInit(): void {
    this.addStudentReactiveForm = new FormGroup({
      studentCode: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  protected onSubmit() {
    if (this.addStudentReactiveForm.valid) {
      this.addBackgroundBlur();

      const sendingSnackBar = this.snackBar.open('Sending...', '', {
        duration: undefined,
      });

      this.studentService
        .addStudent(this.addStudentReactiveForm.value)
        .subscribe({
          next: () => {
            sendingSnackBar.dismiss();
            this.snackBar.open('Student added successfully', 'Close', {
              duration: 1000,
            }).afterDismissed().subscribe(() => {
              this.removeBackgroundBlur();
              this.isAddStudentClicked = false;
              this.addStudentReactiveForm.reset();
              this.refreshStudentsTable();
            });
          },
          error: (err) => {
            sendingSnackBar.dismiss();
            this.snackBar.open('Error adding student', 'Close', {
              duration: 1000,
            }).afterDismissed().subscribe(() => {
              this.removeBackgroundBlur();
            });
            console.log(err);
          },
        });
    }
  }

  private refreshStudentsTable(){
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

  closeForm() {
    this.addStudentReactiveForm.reset();
    this.isAddStudentClicked = !this.isAddStudentClicked;
  }

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
