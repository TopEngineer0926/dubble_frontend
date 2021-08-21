import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { AddContact } from '../../../../store/contacts/contacts.actions';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { MediaService } from '../../../services/media.service';
import { TranslateService } from '@ngx-translate/core';
import { ComponentCanDeactivate } from '../../../interfaces';
import { ContactFormComponent } from '../../../components/contacts/contact-form/contact-form.component';


@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss']
})
export class NewContactComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  readonly appRouteNames = appRouteNames;
  isLoading = false;
  imageToUpload: File;

  @ViewChild(ContactFormComponent) private contactForm: ContactFormComponent;

  private subscription = new Subscription();

  constructor(private store: Store,
              private mediaService: MediaService,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDeactivate() {
    return this.contactForm?.canDeactivate() || true;
  }

  addContact(form) {
    if (!this.imageToUpload) {
      const message = this.translateService.instant('CONTACT.ImageMissing');
      this.snackBarService.error(message);
      return;
    }
    this.isLoading = true;
    this.subscription.add(
      this.store.dispatch(new AddContact(form)).pipe(
        switchMap(data => {
          return this.mediaService.upload('contact', data.contacts.currentContact.contact.itemid, this.imageToUpload);
        }),

        tap((data) => {
          this.contactForm.canDeactivate(true);
          const message = this.translateService.instant('CONTACT.Created');
          this.snackBarService.success(message);
          this.store.dispatch(new Navigate([`/${ appRouteNames.CONTACTS }`]));
        })
      ).subscribe((data) => {
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }

  uploadImage(files) {
    this.imageToUpload = files[0].data;
  }
}
