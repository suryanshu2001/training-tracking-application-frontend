import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';

@Component({
  selector: 'app-upload-multiple-files',
  standalone: true,
  imports: [CommonModule,MatListModule,MatButtonModule,MatIconModule,MatFormFieldModule],
  templateUrl: './upload-multiple-files.component.html',
  styleUrls: ['./upload-multiple-files.component.scss']
})
export class UploadMultipleFilesComponent {
  files: File[] = [];
  id!: number;
  username: string="user";
  @ViewChild('fileInput') fileInput: any;

  constructor(public dialog: MatDialog, private router: Router,@Inject(MAT_DIALOG_DATA) public data: any) {}

  onFileSelected(event: any): void {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      this.files.push(selectedFiles[i]);
    }
  }

  onUpload(): void {
    console.log(this.files);
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      width: '400px',
      data: { files: this.files, id: this.data.topicId, username: this.username } // Pass data to dialog as an object
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result); // Handle dialog result
        // You can update component state with result data here if needed
      } else {
        console.log('Dialog was closed');
      }
    });
  }

  onCancel(){
    //cancel
    this.dialog.closeAll();
  }


  handleUploadClick(event: MouseEvent): void{
    event.preventDefault();
    this.fileInput.nativeElement.click();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleDroppedFiles(files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private handleDroppedFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }

}
