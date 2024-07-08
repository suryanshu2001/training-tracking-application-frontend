import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

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
    @Inject(MAT_DIALOG_DATA) public files: File[]
  ) {}

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  onSave(){
    this.dialogRef.close();
  }

  onClose(){
    this.dialogRef.close();
  }
}
