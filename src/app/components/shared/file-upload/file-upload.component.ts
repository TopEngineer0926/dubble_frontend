import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FileUploadComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload') fileUpload: ElementRef<Input>;

  @Output() uploadedFiles: EventEmitter<any> = new EventEmitter<any>();

  @Input() text = 'Upload';

  /* File extension that accepted, same as 'accept' of <input type="file" />.
   By the default, it's set to 'image/*'. */
  @Input() accept = 'image/*';

  /* Allow multiple files upload **/
  @Input() multiple = true;


  files: Array<FileUploadModel> = [];

  private subscription = new Subscription();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const fileUpload = this.fileUpload.nativeElement as HTMLInputElement;
    fileUpload.onchange = () => {
      this.files = Array.prototype.map.call(fileUpload.files, (file) => {
        return {
          data: file, state: 'in',
          inProgress: false, progress: 0, canRetry: false, canCancel: true
        };
      });
      this.uploadedFiles.emit(this.files);
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    this.removeFileFromArray(file);
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
