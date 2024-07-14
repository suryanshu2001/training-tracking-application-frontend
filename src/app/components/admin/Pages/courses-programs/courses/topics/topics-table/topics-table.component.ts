import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
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
//import { Topic } from 'src/app/components/admin/shared/models/Topic';
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
    private topicService: TopicsTableDataService,
    private _deleteDialog: MatDialog,
    private dialog: MatDialog
  ) {}

  selectedCourse!: any;

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

  protected dataSource!: MatTableDataSource<any>;
  protected editTopicsReactiveForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.selectedCourse = history.state;
    // console.log(this.selectedCourse);
    this.getTopicsList(this.selectedCourse.courseId);

    this.editTopicsReactiveForm = new FormGroup({
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
  // READ DATA
  protected getTopicsList(courseId: number) {
    //this.dataSource=this.selectedCourse.topics;
    this.topicService.getTopicByCourseId(courseId).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // DELETE DATA
  deleteTopics(row: any) {
    // console.log(row.topicId);
    // const dialogRef = this._deleteDialog.open(DeleteDialogueComponent, {
    //   data: {
    //     targetTopicName: row.topicName,
    //   },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     // this.topicService.deleteTopics(row.topicId).subscribe((data) => {
    //     //   this.getTopicsList(this.selectedCourse.courseId);
    //     // });
    //   }
    // });
  }

  // EDIT DATA
  editingRowID: number | null = null;
  protected editTopics(i: number, row: any) {
    // console.log(row);
    this.editingRowID = i;
    this.editTopicsReactiveForm.patchValue(row);
  }

  protected cancelEditing() {
    this.editingRowID = null;
  }

  protected saveTopics(row: any) {
    if (this.editTopicsReactiveForm.valid) {
      this.topicService
        .editTopics(row.topicId, {...this.editTopicsReactiveForm.value,topicId:row.topicId})
        .subscribe((data) => {
          this.editingRowID = null;
          this.getTopicsList(this.selectedCourse.courseId);
        });
    }
  }
// Open dialog for file upload
protected onFilesUploadClick(topicId: number) {
  const dialogRef = this.dialog.open(UploadMultipleFilesComponent, {
    width: '600px', // Adjust width as needed
    data: { topicId: topicId },
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Handle any actions after dialog closes
  });
}

getFileNamesTooltip(files: any[]): string {

  //console.log(files.map((file) => file.fileName).join('\n')) ;
  return files.map((file) => file.fileName).join('\n');
}
}
