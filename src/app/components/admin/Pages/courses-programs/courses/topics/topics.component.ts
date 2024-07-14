import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TableData } from 'src/app/components/admin/shared/models/courses-table.model';
import { TopicsTableComponent } from './topics-table/topics-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
} from '@angular/forms';
import { TopicsTableDataService } from 'src/app/components/shared/Services/topics-table-data.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoursesTableComponent } from '../courses-table/courses-table.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    MatMenuModule,
    OverlayModule,
    TopicsTableComponent,
    MatTooltipModule,
  ],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {
  constructor(private addTopicsData: TopicsTableDataService) {}

  displayedColumns: string[] = [
    'actions',
    'order',
    'topicName',
    'theoryTime',
    'practiceTime',
    'summary',
    'content',
  ];

  selectedCourse!: any;

  selectedCourseId!: number;

  isAddTopicsClicked: boolean = false;

  addTopicsReactiveForm!: FormGroup;

  ngOnInit(): void {
    this.selectedCourse = history.state;
    // console.log(
    //   typeof this.selectedCourse.courseId + ' ' + this.selectedCourse.courseId
    // );

    this.addTopicsReactiveForm = new FormGroup({
      order: new FormControl(null, Validators.required),
      topicName: new FormControl(null, Validators.required),
      theoryTime: new FormControl(null, Validators.required),
      practiceTime: new FormControl(null, Validators.required),
      summary: new FormControl(null, [
        Validators.required,
        Validators.maxLength(40),
      ]),
      content: new FormControl(null, [
        Validators.required,
        Validators.maxLength(40),
      ]),
    });
  }

  onSubmit() {
    if (this.addTopicsReactiveForm.valid) {
      // console.log(this.addTopicsReactiveForm.value);

      this.addTopicsData
        .addTopics(
          this.selectedCourse.courseId,
          this.addTopicsReactiveForm.value
        )
        .subscribe((data) => {
          this.addTopicsReactiveForm.reset();
          this.isAddTopicsClicked = !this.isAddTopicsClicked;
        });
    }
  }

  closeForm() {
    this.addTopicsReactiveForm.reset();
    this.isAddTopicsClicked = !this.isAddTopicsClicked;
  }

  addTopics() {
    this.isAddTopicsClicked = !this.isAddTopicsClicked;
  }

  // 0/40 logic
  // For Content
  protected isContentOpen = false;
  protected lettersTypedContent: number = 0;

  protected onContentInputChange(event: any) {
    this.lettersTypedContent = event.target.value.length;
    return;
  }

  // For Summary
  protected isSummaryOpen = false;
  protected lettersTypedSummary: number = 0;

  protected onSummaryInputChange(event: any) {
    this.lettersTypedSummary = event.target.value.length;
    return;
  }
}
