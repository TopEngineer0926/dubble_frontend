import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subscription } from 'rxjs';
import { SnackBarService } from '../../../services/core/snackbar.service';

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

  constructor(private snackBarService: SnackBarService) {
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

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    let errorStatus = 0;
    let tempfiles = Array.prototype.map.call(files, (file) => {
      return {
        data: file, state: 'in',
        inProgress: false, progress: 0, canRetry: false, canCancel: true
      };
    });
    for (let i = 0; i < tempfiles.length; i++) {
      var mimeType = tempfiles[0].data.type;
      if (
        mimeType.match(/video\/*/) && this.accept.match(/video\/*/) ||
        mimeType.match(/pdf\/*/) && this.accept.match(/pdf\/*/) ||
        mimeType.match(/image\/*/) && this.accept.match(/image\/*/)
      ) {
        errorStatus = 0;
      } else {
        errorStatus = 1;
      }
    }

    if (errorStatus == 0) {
      this.files = tempfiles;
      this.uploadedFiles.emit(this.files);
    } else {
      this.snackBarService.error("Please drag and drop the correct file with extension");
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
