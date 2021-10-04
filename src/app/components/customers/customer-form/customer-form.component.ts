import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../../interfaces/customer';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { UnsavedChanges } from '../../../interfaces/base/unsaved-changes.class';
import { MatDialog } from '@angular/material/dialog';

const ALLOWED_FIELDS = ['customer_number', 'academic_degree_preceding', 'academic_degree_subsequent'];

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent extends UnsavedChanges implements OnInit, OnDestroy {
  customerForm: FormGroup;
  @Input() customer: Customer;
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
    this.customerForm = new FormGroup({
      customer_number: new FormControl(this.customer?.customer_number || ''),
      academic_degree_preceding: new FormControl(this.customer?.academic_degree_preceding || ''),
      academic_degree_subsequent: new FormControl(this.customer?.academic_degree_subsequent || ''),
      firstname: new FormControl(this.customer?.firstname ? this.customer.firstname : '', Validators.required),
      lastname: new FormControl(this.customer?.lastname ? this.customer.lastname : '', Validators.required),
      email: new FormControl(this.customer?.email ? this.customer.email : null, [Validators.email]),
      phone_number: new FormControl(this.customer?.phone_number ? this.customer.phone_number : null),
      company_name: new FormControl(this.customer?.company_name || ''),
      itemid: new FormControl(this.customer?.itemid ? this.customer.itemid : '')
    });
    this.trackChanges(this.customerForm);
  }

  updateCustomer() {
    if (this.customerForm.invalid) {
      const message = this.translateService.instant('COMMON.FillRequiredFields');
      this.snackBarService.error(message);
      return;
    }
    const formData = {
      ...this.customerForm.value
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
