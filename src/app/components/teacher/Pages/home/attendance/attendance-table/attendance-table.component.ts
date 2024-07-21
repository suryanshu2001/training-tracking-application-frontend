import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
  FormsModule,
} from '@angular/forms';
import { AttendanceService } from 'src/app/components/teacher/shared/Services/attendance.service';
import { MatTableDataSource } from '@angular/material/table';
import { concat } from 'rxjs';
@Component({
  selector: 'app-attendance-table',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgFor,
  ],
  templateUrl: './attendance-table.component.html',
  styleUrls: ['./attendance-table.component.scss'],
})
export class AttendanceTableComponent implements OnInit {
  displayedColumns: string[] = [
    'actions',
    'topicName',
    'topicPercentageCompleted',
  ];

  dataSource!: MatTableDataSource<any>;
  allChecked: boolean= false;
  // parent payload
  @Input() parentFormData!: any;
  @Input() enabledTable!: boolean;

  studentAttendances!: any[];
  modifiedStudentAttendances!: any[];
  dailyTopicCoverages!:MatTableDataSource<any>;
  selectedTopicPercentageCompleted: any="Enter topic % completed!";
  array1: number[]=[1];

  attendanceReactiveForm!: FormGroup;
  attendanceId: any;
  filteredTopics: any;
  studentsToUpdate: any[]=[];

  constructor(private attendanceService: AttendanceService) {}
  ngOnInit(): void {
    this.getAttendance();
    console.log("parentFormDataa:",this.parentFormData)
    this.attendanceReactiveForm = new FormGroup({
      topic: new FormControl(null, Validators.required),
      topicPercentageCompleted: new FormControl(null, Validators.required),
    });
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.attendanceReactiveForm.valid) {
      const payload = {
        attendance:{attendanceId:this.attendanceId},
        topic:{topicId:this.attendanceReactiveForm.get('topic')?.value.topicId},
        dailyCoverage:this.attendanceReactiveForm.get('topicPercentageCompleted')?.value-this.selectedTopicPercentageCompleted
      };
      console.log("payload:",payload,this.attendanceReactiveForm.get('topicPercentageCompleted')?.value-this.selectedTopicPercentageCompleted);
      this.attendanceService.addTopic(payload).subscribe({
        next: (data) => {
          console.log("topic added:",data);
          const newPayload={...payload,bpctId:this.attendanceReactiveForm.get('topic')?.value.batchProgramCourseTopicId}
          this.updateCourseCoverageOfTopic(newPayload);
        },
      });
    }
  }

  getAttendance() {
    this.attendanceService.getAttendanceByDate(this.parentFormData.cto.bpcId,this.formatDateToDDMMYYYY(this.parentFormData.date)).subscribe({
      next: (data: any) => {
        console.log("attendence data:",data)
        this.attendanceId=data.attendanceId;
        this.studentAttendances = JSON.parse(JSON.stringify(data?.attendanceStudents));
        this.modifiedStudentAttendances = JSON.parse(JSON.stringify(data?.attendanceStudents));
        this.dailyTopicCoverages= new MatTableDataSource(data?.dailyTopicCoverages);
        //this.dataSource = new MatTableDataSource(data);
        this.filteredTopics = this.parentFormData.cto.topicsInProgress.filter((topic:any) => {
          return !data.dailyTopicCoverages.some((coverage:any) =>{
            return coverage.topic.topicId === topic.topicId
          }
          )
        }
        );
        console.log("filtered topics:",this.filteredTopics)
      },
    });
  }

  closeForm() {
    this.attendanceReactiveForm.reset();
    this.parentFormData = null;
    this.enabledTable = false;
  }


  toggleAll() {
    this.modifiedStudentAttendances.forEach(student => student.isPresent = this.allChecked);
  }

  updateAllChecked() {
    this.allChecked = this.modifiedStudentAttendances.every(student => student.isPresent);
    console.log("updated studentAttendence:",this.modifiedStudentAttendances,this.studentAttendances)
  }

  updateChanges() {
    console.log("update students:",this.modifiedStudentAttendances);
    this.modifiedStudentAttendances.forEach((obj)=>{
      this.studentsToUpdate.push({
        attendance:{attendanceId:obj.attendance.attendanceId},
        attendanceStudentId:obj.attendanceStudentId,
        student:{studentId:obj.student.studentId},
        isPresent:obj.isPresent
      })
    })
    this.attendanceService.updateAttendance(this.studentsToUpdate).subscribe({
      next: (data) => {
        console.log("attendence modified:",data)
      }
    })
  }

  cancelChanges() {
    this.modifiedStudentAttendances = JSON.parse(JSON.stringify(this.studentAttendances));
    this.updateAllChecked();
    console.log("after cancel:", this.modifiedStudentAttendances, this.studentAttendances);
  }

  onTopicChange(event:any){
    this.selectedTopicPercentageCompleted=event.value.percentageCompleted;
    console.log("on topic change:",event,this.selectedTopicPercentageCompleted)
  }

  updateCourseCoverageOfTopic(data:any){
    console.log("dataaaaa:",data)
    const payload={
      batchProgramCourse:{batchProgramCourseId:this.parentFormData.cto.bpcId},
      topic:data.topic,
      batchProgramCourseTopicId:data.bpctId,
      percentageCompleted:this.attendanceReactiveForm.get('topicPercentageCompleted')?.value
    }
    this.attendanceService.updateCourseCoverageOfTopic(payload).subscribe({
      next: (data) => {
        console.log("course Coverage modified:",data)
        window.location.reload();
      }
    })
  }

}
