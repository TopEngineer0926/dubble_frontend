import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Media, ExtendedFileUploadEvent } from '../../../interfaces';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../../components/deleteConfirm/delete-confirm-dialog.component';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnInit, OnChanges, OnDestroy {
  @Output() uploadedVideo: EventEmitter<ExtendedFileUploadEvent> = new EventEmitter<ExtendedFileUploadEvent>();
  @Input() video: Media;
  @Input() isLoading: boolean;

  videoTitleControl = new FormControl();

  videoUrl: string | ArrayBuffer;
  hideVideo = true;

  // get vimeoUrl(): string { // Commented as we are getting vimeo url from backend
  //   const videoLink = (this.videoUrl as string).split('/');
  //   return `https://player.vimeo.com/video/${ videoLink[videoLink.length - 1] }?title=0&byline=0&portrait=0'`;
  // }

  private videoToUpload: File;
  private destroy$ = new Subject();

  constructor(private elementRef: ElementRef<any>, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.videoUrl = this.video?.url || '';
    if (this.videoUrl) {
      this.hideVideo = false;
    }
    this.videoTitleControl.patchValue(this.video?.title, { emitEvent: false });
    this.videoTitleControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.upload());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes) {
    if (changes.video) {
      // this.videoUrl = this.video?.url || null; // Commented as it takes time for vimeo URL to be available on vimeo
      this.videoTitleControl.patchValue(this.video?.title, { emitEvent: false });
    }
  }

  uploadVideo(event) {
    this.videoToUpload = event?.length && event[0].data;
    if (this.videoToUpload) {
      this.hideVideo = false;
    }
    this.preview(event);
    this.upload();
  }

  upload() {
    const uploadData: ExtendedFileUploadEvent = { file: this.videoToUpload, title: this.videoTitleControl.value?.trim() };
    if (!uploadData.file && !uploadData.title) {
      return;
    }
    this.uploadedVideo.emit(uploadData);
  }

  removeVideo() {
    const video = this.elementRef.nativeElement.querySelector('video');
    const source = video?.querySelector('source');
    if (video && source) {
      video.removeChild(source);
    }
    this.uploadedVideo.emit(null);
    this.videoToUpload = null;
    this.videoUrl = '';
    this.hideVideo = true;
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].data.type;
    if (mimeType.match(/video\/*/) == null) {
      // this.message = "Only videos are supported.";
      return;
    }

    setTimeout(() => {
      const reader = new FileReader();
      reader.readAsDataURL(files[0].data);
      reader.onload = (event) => {
        const video = this.elementRef.nativeElement.querySelector('video');
        const videoSource = document.createElement('source');
        videoSource.setAttribute('src', event.target.result as string);
        video.appendChild(videoSource);
        video.load();
        this.hideVideo = false;
      };
    });
  }

  deleteVideo() {
    if (this.videoToUpload || this.videoTitleControl.value) {
      const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.removeVideo();
          this.videoTitleControl.reset("");
        }
      });
    }
  }
}
