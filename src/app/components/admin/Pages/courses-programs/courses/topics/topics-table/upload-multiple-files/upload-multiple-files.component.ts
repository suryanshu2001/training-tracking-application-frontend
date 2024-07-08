import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
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
  @ViewChild('fileInput') fileInput: any;

  constructor(public dialog: MatDialog, private router: Router) {}

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
      data: this.files
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
