import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ListResponse, Media} from '../../../interfaces';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  @Output() uploadedImg = new EventEmitter();
  @Input() img: Media;
  @Input() uploadLabel: string;

  imgUrl: string | ArrayBuffer;
  constructor() { }

  ngOnInit(): void {
    this.imgUrl = this.img?.url || '';
  }
  uploadImage(event) {
  this.uploadedImg.emit(event);
  this.preview(event);
  }
  removeImg(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.uploadedImg.emit(null);
    this.imgUrl = '';
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].data.type;
    if (mimeType.match(/image\/*/) == null) {
     // this.message = "Only images are supported.";
      return;
    }

    const reader = new FileReader();
    // this.imagePath = files;
    reader.readAsDataURL(files[0].data);
    reader.onload = (event) => {
      this.imgUrl = reader.result;
    };
  }
}
