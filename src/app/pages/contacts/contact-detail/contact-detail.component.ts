import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DeleteContactMedia, GetContactById, SaveContactMedia, UpdateContact } from '../../../../store/contacts/contacts.actions';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { ContactsState } from '../../../../store/contacts/contacts.state';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate, Contact, ListResponse, Media } from '../../../interfaces';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { Navigate } from '@ngxs/router-plugin';
import { appRouteNames } from '../../../constants/app-route-names';
import { TranslateService } from '@ngx-translate/core';
import { ContactFormComponent } from '../../../components/contacts/contact-form/contact-form.component';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  currentContact: { contact: Contact, media: ListResponse<Media> };
  isLoading = false;

  @ViewChild(ContactFormComponent) private contactForm: ContactFormComponent;

  private hasImage: boolean;

  private subscription = new Subscription();

  constructor(private store: Store,
              private route: ActivatedRoute,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription.add(
      this.route.params.pipe(
        mergeMap((params) => this.store.dispatch(new GetContactById(params.id)).pipe(
          switchMap(() => this.store.select(ContactsState.currentContact))
          )
        )).subscribe((contact: { contact: Contact, media: ListResponse<Media> }) => {
        this.isLoading = false;
        this.currentContact = contact;
        this.hasImage = Boolean(this.currentContact.media?.list?.length);
      }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDeactivate() {
    return this.contactForm?.canDeactivate() || true;
  }

  uploadImage(img: File) {
    if (img) {
      this.saveContactImg(img);
    } else {
      this.removeContactImg();
    }
  }

  editContact(form) {
    if (!this.hasImage) {
      const message = this.translateService.instant('CONTACT.ImageMissing');
      this.snackBarService.error(message);
      return;
    }
    this.isLoading = true;
    this.subscription.add(
      this.store.dispatch(new UpdateContact(form)).pipe(
        tap((data) => {
          this.contactForm.canDeactivate(true);
          const message = this.translateService.instant('CONTACT.Updated');
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

  saveContactImg(img) {
    this.isLoading = true;
    this.subscription.add(
      this.store.dispatch(new SaveContactMedia(this.currentContact.contact.itemid, img[0].data))
        .subscribe((data) => {
            this.hasImage = true;
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            this.snackBarService.error(error.error?.message || error.message);
          })
    );
  }

  removeContactImg() {
    this.isLoading = true;
    this.subscription.add(
      this.store.dispatch(new DeleteContactMedia(this.currentContact.media.list[0].itemid))
        .subscribe((data) => {
            this.hasImage = false;
          },
          error => this.snackBarService.error(error.error?.message || error.message)));
  }

}
