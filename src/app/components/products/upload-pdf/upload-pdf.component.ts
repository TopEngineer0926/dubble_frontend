import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ExtendedFileUploadEvent, Media } from '../../../interfaces';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../../components/deleteConfirm/delete-confirm-dialog.component';

@Component({
  selector: 'app-upload-pdf',
  templateUrl: './upload-pdf.component.html',
  styleUrls: ['./upload-pdf.component.scss']
})
export class UploadPdfComponent implements OnInit, OnChanges, OnDestroy {
  @Output() uploadedPdf: EventEmitter<ExtendedFileUploadEvent> = new EventEmitter();
  @Input() pdf: Media;

  titleControl = new FormControl();

  pdfUrl: string | ArrayBuffer = '';

  private fileToUpload: File;
  private destroy$ = new Subject();

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.pdfUrl = this.pdf?.url || '';
    this.titleControl.patchValue(this.pdf?.title, { emitEvent: false });
    this.titleControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.upload());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes) {
    if (changes.pdf) {
      this.pdfUrl = this.pdf?.url || null;
      this.titleControl.patchValue(this.pdf?.title, { emitEvent: false });
    }
  }

  uploadPdf(event) {
    this.fileToUpload = event?.length && event[0].data;
    this.preview(event);
    this.upload();
  }

  upload() {
    const uploadData: ExtendedFileUploadEvent = { file: this.fileToUpload, title: this.titleControl.value?.trim() };
    if (!uploadData.file && !uploadData.title) {
      return;
    }
    this.uploadedPdf.emit(uploadData);
  }

  removePdf() {
    this.uploadedPdf.emit(null);
    this.fileToUpload = null;
    this.pdfUrl = '';
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].data.type;
    if (mimeType.match(/pdf\/*/) == null) {
      // this.message = "Only PDFs are supported.";
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0].data);
    reader.onload = (event) => {
      this.pdfUrl = reader.result;
    };
  }

  deletePdf() {
    if (this.fileToUpload || this.titleControl.value) {
      const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.removePdf();
          this.titleControl.reset("");
        }
      });
    }
  }
}
