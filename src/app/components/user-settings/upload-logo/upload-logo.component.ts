import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {DeleteUserMedia, SaveUserMedia} from '../../../../store/auth.actions';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { Store } from '@ngxs/store';
import { Media } from '../../../interfaces';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-logo',
  templateUrl: './upload-logo.component.html',
  styleUrls: ['./upload-logo.component.scss']
})
export class UploadLogoComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  @Input() logo: Media;

  private subscription = new Subscription();

  constructor(private store: Store,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeLogo() {
    this.subscription.add(
      this.store.dispatch(new DeleteUserMedia(this.logo.itemid)).subscribe(data => {},
        error => this.snackBarService.error(error.error?.message || error.message)));
  }

  uploadLogo(files) {
    this.subscription.add(
      this.store.dispatch(new SaveUserMedia(this.userId, files[0].data)).subscribe(() => {
        },
        error => this.snackBarService.error(error.error?.message || error.message)));
  }
}
