import { Component, OnInit } from '@angular/core';
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
import { CourseTableDataService } from '../../../../shared/Services/course-table-data.service';
import { ProgramsTableService } from '../../../../shared/Services/programs-table.service';
import { ProgramsTableComponent } from './programs-table/programs-table.component';
@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ProgramsTableComponent,
  ],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss'],
})
export class ProgramsComponent implements OnInit {
  constructor(
    private courseTableData: CourseTableDataService,
    private programService: ProgramsTableService
  ) {}

  isAddProgramsClicked: boolean = false;
  lettersTypedDesc: number = 0;
  isDescOpen: boolean = false;
  addProgramsReactiveForm!: FormGroup;
  courses: any[] = [];

  displayedColumns: string[] = [
    'actions',
    'code',
    'programName',
    'theoryTime',
    'practiceTime',
    'description',
    'course',
  ];

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

    this.addProgramsReactiveForm = new FormGroup({
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

  onInputChange(event: any) {
    this.lettersTypedDesc = event.target.value.length;
    return;
  }

  onSubmit() {
    console.log(this.addProgramsReactiveForm.value);
    if (this.addProgramsReactiveForm.valid) {
      this.programService
        .addPrograms(this.addProgramsReactiveForm.value)
        .subscribe({
          next: () => {
            this.isAddProgramsClicked = !this.isAddProgramsClicked;
            this.addProgramsReactiveForm.reset();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  closeForm() {
    this.addProgramsReactiveForm.reset();
    this.isAddProgramsClicked = !this.isAddProgramsClicked;
  }
}
