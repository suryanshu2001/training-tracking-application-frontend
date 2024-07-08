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
@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TopicsTableComponent,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    OverlayModule,
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

  selectedCourse!: TableData;

  isAddTopicsClicked: boolean = false;

  addTopicsReactiveForm!: FormGroup;

  ngOnInit(): void {
    this.selectedCourse = history.state;

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
      this.addTopicsData
        .addTopics(this.selectedCourse.code, this.addTopicsReactiveForm.value)
        .subscribe({
          next: (data: any) => {
            // add snackbar - topics
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            this.closeForm();
          },
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
  isSummaryOpen = false;
  isContentOpen = false;
  lettersTypedDesc: number = 0;
  onInputChange(event: any) {
    this.lettersTypedDesc = event.target.value.length;
    return;
  }
}
