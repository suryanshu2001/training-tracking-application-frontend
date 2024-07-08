import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableData } from 'src/app/components/admin/shared/models/courses-table.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CourseTableDataService } from 'src/app/components/shared/Services/course-table-data.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { Router, NavigationExtras, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { DeleteDialogueComponent } from '../../../../../shared/delete-dialogue/delete-dialogue.component';
import { TopicsData } from 'src/app/components/admin/shared/models/topics-table.model';
import { TopicsTableDataService } from 'src/app/components/shared/Services/topics-table-data.service';

@Component({
  selector: 'app-courses-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    OverlayModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatDialogModule,
    RouterModule,
    MatTooltipModule,
  ],
  templateUrl: './courses-table.component.html',
  styleUrls: ['./courses-table.component.scss'],
})
export class CoursesTableComponent implements OnInit {
  constructor(
    private courseTableData: CourseTableDataService,
    private addTopicsData: TopicsTableDataService,
    public _deleteDialog: MatDialog,
    private router: Router
  ) {}

  // reactive form
  protected editCourseReactiveForm!: FormGroup;

  displayedColumns: string[] = [
    'actions',
    'code',
    'course',
    'theoryTime',
    'practiceTime',
    'description',
    'addTopics',
  ];

  topicsData: any[] = [];

  dataSource!: MatTableDataSource<TableData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // READ DATA
  ngOnInit(): void {
    // get the list of courses when page is loaded
    this.getCoursesList();

    // reactive form init
    this.editCourseReactiveForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      theoryTime: new FormControl(null, Validators.required),
      practiceTime: new FormControl(null, Validators.required),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(40),
      ]),
    });

    // putting topic data inside topicData array
    this.addTopicsData.getTopics().subscribe({
      next: (data) => {
        this.topicsData = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // READ DATA
  protected getCoursesList() {
    this.courseTableData.getCourses().subscribe({
      next: (data) => {
        // console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // DELETE DATA
  protected deleteCourse(id: string, code: string, course: string) {
    const dialogRef = this._deleteDialog.open(DeleteDialogueComponent, {
      data: { targetCode: code, targetCourse: course },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courseTableData.deleteCourses(id).subscribe({
          next: (data) => {
            this.getCoursesList();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  // EDIT DATA
  editingRowID: number | null = null;
  protected editCourse(i: number, row: TableData) {
    // console.log(row);
    this.editingRowID = i;
    this.editCourseReactiveForm.patchValue(row);
  }

  protected cancelEditing() {
    this.editingRowID = null;
  }

  protected saveCourse(row: any) {
    // console.log(row.id);
    if (this.editCourseReactiveForm.valid) {
      this.courseTableData
        .editCourses(row.id, this.editCourseReactiveForm.value)
        .subscribe({
          next: (data) => {
            this.editingRowID = null;
            this.getCoursesList();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  // overlay stuff
  protected isDescOpen = false;

  // logic for letters / 40 in desc
  protected lettersTypedDesc: number = 0;

  protected onInputChange(event: any, type: string) {
    if (type == 'description') {
      this.lettersTypedDesc = event.target.value.length;
      return;
    }
  }

  // getRemaingTopics
  getRemainingTopics(topics: any[]): string {
    const remainingTopics = topics.slice(3);
    return remainingTopics
      .map((topic, index) => `${index + 1}. ${topic.topicName}`)
      .join('\n');
  }

  // routing
  navigateToTopics(row: any) {
    const routerLink = ['admin', 'home', 'topics', row.code];
    this.router.navigate(routerLink, { state: row });
  }
}
