import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  NgForm,
  FormsModule,
} from '@angular/forms';
import { TopicsTableDataService } from 'src/app/components/shared/Services/topics-table-data.service';
import { DeleteDialogueComponent } from '../../../../../../shared/delete-dialogue/delete-dialogue.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TopicsData } from 'src/app/components/admin/shared/models/topics-table.model';
import { UploadMultipleFilesComponent } from './upload-multiple-files/upload-multiple-files.component';
@Component({
  selector: 'app-topics-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './topics-table.component.html',
  styleUrls: ['./topics-table.component.scss'],
})
export class TopicsTableComponent implements OnInit {
  constructor(
    private addTopicsData: TopicsTableDataService,
    private _deleteDialog: MatDialog,
    private dialog: MatDialog
  ) {}

  routedTopic!: string;

  displayedColumns: string[] = [
    'actions',
    'order',
    'topicName',
    'theoryTime',
    'practiceTime',
    'summary',
    'content',
    'files',
  ];

  protected dataSource!: MatTableDataSource<TopicsData>;
  protected editTopicsReactiveForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getTopicsList();

    // console.log(history.state);
    this.routedTopic = history.state.code;

    // reactive form init
    this.editTopicsReactiveForm = new FormGroup({
      order: new FormControl(null, Validators.required),
      topicName: new FormControl(null, Validators.required),
      theoryTime: new FormControl(null, Validators.required),
      practiceTime: new FormControl(null, Validators.required),
      summary: new FormControl(null, [
        Validators.required,
        Validators.maxLength(40),
      ]),
      content: new FormControl(null, [Validators.required]),
      files: new FormControl(null),
    });
  }
  // READ DATA
  protected getTopicsList() {
    this.addTopicsData.getTopics().subscribe({
      next: (data: any) => {
        console.log(data);
        const topicArrays = [];
        for (const obj of data) {
          if (
            obj.topic &&
            Array.isArray(obj.topic) &&
            obj.code == this.routedTopic
          ) {
            topicArrays.push(...obj.topic);
          }
        }
        // put the topic array in the data source
        this.dataSource = new MatTableDataSource(topicArrays);
        // console.log(this.dataSource);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('data has been fetched !');
      },
    });
  }

  // DELETE DATA
  deleteTopics(topicName: string) {
    const dialogRef = this._deleteDialog.open(DeleteDialogueComponent, {
      data: { targetTopicName: topicName },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // console.log(topicName + 'topicName coming from topic-table-component');
        this.addTopicsData.deleteTopics(this.routedTopic, topicName).subscribe({
          next: (data: any) => {
            console.log('emp deleted');
            this.getTopicsList();
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            console.log('data has been deleted !');
          },
        });
      }
    });
  }

  // EDIT DATA
  editingRowID: number | null = null;
  protected editTopics(i: number, row: any) {
    // console.log(row);
    this.editingRowID = i;
    this.populateEditFields(row);
  }

  protected populateEditFields(row: any) {
    // console.log(row.order);
    this.editTopicsReactiveForm.patchValue({
      order: row.order,
      topicName: row.topicName,
      theoryTime: row.theoryTime,
      practiceTime: row.practiceTime,
      summary: row.summary,
      content: row.content,
    });
  }

  protected cancelEditing() {
    this.editingRowID = null;
  }

  protected saveTopics(row: any, oldTopicName: string) {
    // console.log(row.id);
    if (this.editTopicsReactiveForm.valid) {
      this.addTopicsData
        .editTopics(
          this.routedTopic,
          this.editTopicsReactiveForm.value,
          oldTopicName
        )
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.editingRowID = null;
            this.getTopicsList();
          },
        });
    }
  }

  onFilesUploadClick() {
    //Upload Dialog
    this.openUploadDialog();
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadMultipleFilesComponent, {
      width: '800px',
      height: '400px',
    });
  }
}
