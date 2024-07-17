import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { ProgramsTableService } from 'src/app/components/shared/Services/programs-table.service';
import { StudentTableService } from 'src/app/components/shared/Services/student-table.service';
import { BatchProgramsService } from 'src/app/components/shared/Services/batch-programs.service';
import {
  BatchLayer2Data,
  BatchPrograms,
} from 'src/app/components/admin/shared/models/batch-layer2.model';
import { BatchProgramCoursesService } from 'src/app/components/shared/Services/batch-program-courses.service';

@Component({
  selector: 'app-batches-program-add',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './batches-program-add.component.html',
  styleUrls: ['./batches-program-add.component.scss'],
})
export class BatchesProgramAddComponent implements OnInit {
  addBatchProgramReactiveForm!: FormGroup;

  // comes from parent
  @Input() batchId!: number;

  programCodes: string[] = [];
  programs: any[] = [];
  enrolledBatches!: any[];

  students: any[] = [];

  displayedColumns: string[] = ['actions', 'code', 'programName', 'students'];

  constructor(
    private programService: ProgramsTableService,
    private studentService: StudentTableService,
    private batchProgramsService: BatchProgramsService,
    private batchProgramCourseService: BatchProgramCoursesService
  ) {}

  ngOnInit(): void {
    // reactive form init
    this.getPrograms();
    this.getStudents();
    this.addBatchProgramReactiveForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      program: new FormControl(null, Validators.required),
      students: new FormControl(null, Validators.required),
    });
  }

  getPrograms() {
    this.programService.getPrograms().subscribe({
      next: (res: any) => {
        for (const obj of res) {
          this.programCodes.push(obj.programCode);
          this.programs.push(obj);
        }

        // console.log(this.programCodes + '|' + this.programNames);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.getBatchPrograms();
  }

  getStudents() {
    this.studentService.getStudents().subscribe({
      next: (res: any) => {
        for (const obj of res) {
          this.students.push(obj);
        }
        // console.log(this.students);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onProgramChange(event: any) {
    const index = this.programs.indexOf(event.value);
    const code = this.programCodes[index];
    this.addBatchProgramReactiveForm.get('code')?.setValue(code);
  }

  onSubmit() {
    if (this.addBatchProgramReactiveForm.valid) {
      const batchProgramForm = {
        ...this.addBatchProgramReactiveForm.value
      };

      this.batchProgramCourseService.getAllProgramsByBatch(this.batchId).subscribe({
        next: (value) => {
          const program = value.find((x:any) => x.programCode === batchProgramForm.code);


          // if (program) {
            if (false) {
            console.log("if executed")
            // If the batchProgram exists, update its batchPrograms array
            const updatedBatchProgram = {
              ...program,
              batchPrograms: [...program, batchProgramForm],
            };

            this.batchProgramCourseService
              .updateBatchProgramCourse(program.id,updatedBatchProgram)
              .subscribe({
                next: () => {
                  console.log('Batch program updated successfully');
                  this.closeForm();
                },
                error: (err) => {
                  console.log(err);
                },
              });

            this.addBatchProgramReactiveForm.reset();
          } else {
            console.log("else executed")
            // If the batchProgram does not exist, create a new one
            const newBatchProgram: any = {
              batch:{batchId: this.batchId},
              program:{programId:batchProgramForm.program.programId},
              students:batchProgramForm.students
            };

            console.log("new batch-program-student:",batchProgramForm,newBatchProgram)
            this.batchProgramCourseService
              .addBatchProgramCourses(newBatchProgram)
                .subscribe({
                next: (res: any) => {
                  console.log(this.batchId);
                  this.closeForm();
                  window.location.reload();
                },
                error: (err) => {
                  console.log(err);
                },
              });
            this.addBatchProgramReactiveForm.reset();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getBatchPrograms() {
    this.batchProgramCourseService.getAllProgramsByBatch(this.batchId).subscribe({
      next: (value) => {
        //this.dataSource=value;
        this.enrolledBatches = value; // Initialize the dataSource with the fetched value
        //this.getPrograms();
        const arr2: any[] = this.enrolledBatches; // Get the actual data array

      this.programs = this.programs.filter(program =>
        !arr2.some(data => program.programId === data.programId)
      );
      },
      error: (err) => {
        console.error("Error fetching batch programs:", err);
      }
    });

    //console.log("All DataSource:",this.dataSource)
  }

  // send boolean value from child to parent to let them know that the add program form must be closed
  @Output() isAddClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  closeForm() {
    this.isAddClicked.emit(false);
    // console.log(this.isAddClicked);
  }
}
