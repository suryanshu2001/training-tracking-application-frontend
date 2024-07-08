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
  @Input() batchCode!: string;

  programCodes: string[] = [];
  programNames: string[] = [];

  students: any[] = [];

  displayedColumns: string[] = ['actions', 'code', 'programName', 'students'];

  constructor(
    private programService: ProgramsTableService,
    private studentService: StudentTableService,
    private batchProgramsService: BatchProgramsService
  ) {}

  ngOnInit(): void {
    // reactive form init
    this.getPrograms();
    this.getStudents();
    this.addBatchProgramReactiveForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      programName: new FormControl(null, Validators.required),
      students: new FormControl(null, Validators.required),
    });
  }

  getPrograms() {
    this.programService.getPrograms().subscribe({
      next: (res: any) => {
        for (const obj of res) {
          this.programCodes.push(obj.code);
          this.programNames.push(obj.programName);
        }

        // console.log(this.programCodes + '|' + this.programNames);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
    const index = this.programNames.indexOf(event.value);
    const code = this.programCodes[index];
    this.addBatchProgramReactiveForm.get('code')?.setValue(code);
  }

  onSubmit() {
    if (this.addBatchProgramReactiveForm.valid) {
      const batchProgramForm = {
        ...this.addBatchProgramReactiveForm.value,
        id: crypto.randomUUID(),
      };

      this.batchProgramsService.getBatchProgram().subscribe({
        next: (res: any[]) => {
          const batchProgram = res.find(
            (obj) => obj.batchCode === this.batchCode
          );

          if (batchProgram) {
            // If the batchProgram exists, update its batchPrograms array
            const updatedBatchProgram = {
              ...batchProgram,
              id: crypto.randomUUID(),
              batchPrograms: [...batchProgram.batchPrograms, batchProgramForm],
            };

            this.batchProgramsService
              .updateBatchProgram(batchProgram.id, updatedBatchProgram)
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
            // If the batchProgram does not exist, create a new one
            const newBatchProgram: any = {
              batchCode: this.batchCode,
              batchPrograms: [batchProgramForm],
            };

            this.batchProgramsService
              .addBatchPrograms(newBatchProgram)
              .subscribe({
                next: (res: any) => {
                  console.log(this.batchCode);
                  this.closeForm();
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

  // send boolean value from child to parent to let them know that the add program form must be closed
  @Output() isAddClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  closeForm() {
    this.isAddClicked.emit(false);
    // console.log(this.isAddClicked);
  }
}
