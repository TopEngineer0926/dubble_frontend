import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {DeleteUserMedia, SaveUserMedia} from '../../../../store/auth.actions';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { Store } from '@ngxs/store';
import { Media } from '../../../interfaces';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-upload-logo',
  templateUrl: './upload-logo.component.html',
  styleUrls: ['./upload-logo.component.scss']
})
export class UploadLogoComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  @Input() logo: Media;
  @Input() isMaster: Boolean = false;

  private subscription = new Subscription();

  constructor(private store: Store,
              private snackBarService: SnackBarService,
              protected httpClient: HttpClient,
              private translateService: TranslateService) {
  }

  protected masterLogoUrl = environment.apiUrl + 'account/masterlogo';
  masterLogo: string = "";
  masterLogoFileName: string = "";
  disableCopyBtn: Boolean = false;
  showCopyBtn: Boolean = false;

  ngOnInit(): void {
    if (this.logo) {
      this.disableCopyBtn = true
    }
    if (this.isMaster) {
      this.getMasterLogo()
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeLogo() {
    this.subscription.add(
      this.store.dispatch(new DeleteUserMedia(this.logo.itemid)).subscribe(data => {
        this.disableCopyBtn = false
      },
        error => this.snackBarService.error(error.error?.message || error.message)));
  }

  uploadLogo(files) {
    this.subscription.add(
      this.store.dispatch(new SaveUserMedia(this.userId, files[0].data)).subscribe(() => {
        this.disableCopyBtn = true
        },
        error => this.snackBarService.error(error.error?.message || error.message)));
  }

  copyMasterLogo() {
    this.httpClient.put<any>(`${this.masterLogoUrl}`, this.masterLogoFileName)
      .subscribe((response) => {
        this.snackBarService.success("Copy master logo success");
      },
      error => {
          this.snackBarService.error(error.error?.message || error.message);
      });
  }

  getMasterLogo() {
    this.httpClient.get<any>(`${this.masterLogoUrl}`)
      .subscribe((response) => {
          if (response.result) {
            this.masterLogoFileName = response.result
            this.masterLogo = environment.webUrl + "img/" + response.result 
            this.showCopyBtn = true
          } else {
            this.showCopyBtn = false
          }
      },
      error => {
        this.showCopyBtn = false
      });
  }
}
