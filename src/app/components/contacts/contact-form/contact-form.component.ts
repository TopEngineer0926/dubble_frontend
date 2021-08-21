import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../../../interfaces';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { UnsavedChanges } from '../../../interfaces/base/unsaved-changes.class';
import { MatDialog } from '@angular/material/dialog';
import { startWith, takeUntil } from 'rxjs/operators';
import { merge } from 'rxjs';

const ALLOWED_FIELDS = ['abbreviation'];
@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent extends UnsavedChanges implements OnInit, OnDestroy {
  contactForm: FormGroup;
  @Input() contact: Contact;
  @Input() isLoading: boolean;
  @Output() submitEvent = new EventEmitter();

  constructor(protected dialog: MatDialog,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) {
    super(dialog);
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy() {
    this.destroy();
  }

  initForm() {
    this.contactForm = new FormGroup({
      firstname: new FormControl(this.contact?.firstname ? this.contact.firstname : '', Validators.required),
      lastname: new FormControl(this.contact?.lastname ? this.contact.lastname : '', Validators.required),
      email: new FormControl(this.contact?.email ? this.contact.email : '', [Validators.email]),
      phone_number: new FormControl(this.contact?.phone_number ? this.contact.phone_number : ''),
      abbreviation: new FormControl(this.contact?.abbreviation || ''),
      itemid: new FormControl(this.contact?.itemid ? this.contact.itemid : '')
    });

    this.trackChanges(this.contactForm);
  }

  updateContact() {
    if (this.contactForm.invalid) {
      const message = this.translateService.instant('COMMON.FillRequiredFields');
      this.snackBarService.error(message);
      return;
    }
    if (this.isLoading) {
      return;
    }
    const formData = {
      ...this.contactForm.value
    };
    this.validateEmptyFields(formData);
    this.submitEvent.emit(formData);
  }

  private validateEmptyFields(target: object): void {
    if (!target || typeof target !== 'object') {
      return;
    }
    for (const key in target) {
      if (target.hasOwnProperty(key) && !ALLOWED_FIELDS.includes(key)) {
        if (target[key] === undefined || (typeof target[key] === 'string' && target[key].trim() === '')) {
          target[key] = null;
        }
      }
    }
  }
}
