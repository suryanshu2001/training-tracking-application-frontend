import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TopicsTableDataService } from 'src/app/components/shared/Services/topics-table-data.service';

@Component({
  selector: 'app-file-upload-dialog',
  standalone: true,
  imports: [CommonModule, CommonModule,MatIconModule,MatDialogModule,MatDividerModule,MatButtonModule],
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    private topicService: TopicsTableDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  removeFile(index: number): void {
    this.data.files.splice(index, 1);
  }
  // onSave() {
  //   for (const file of this.data.files) {
  //     this.topicService.uploadTopicFile(this.data.id, file, this.data.username).subscribe(
  //       response => {
  //         console.log('File uploaded successfully', response);
  //       },
  //       error => {
  //         console.error('Error uploading file', error);
  //       }
  //     );
  //   }
  // }
  onSave(){
    console.log("object to upload",this.data)
    this.topicService.uploadTopicFiles(this.data.id,this.data.files,this.data.username).subscribe();
    this.dialogRef.close();
  }

  onClose(){
    this.dialogRef.close();
  }
}
