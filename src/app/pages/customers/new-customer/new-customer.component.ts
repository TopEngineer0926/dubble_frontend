import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { MediaService } from '../../../services/media.service';
import { AddCustomer } from '../../../../store/customers/customers.actions';
import { TranslateService } from '@ngx-translate/core';
import { ComponentCanDeactivate } from '../../../interfaces';
import { CustomerFormComponent } from '../../../components/customers/customer-form/customer-form.component';


@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss']
})
export class NewCustomerComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  readonly appRouteNames = appRouteNames;

  @ViewChild(CustomerFormComponent) private customerForm: CustomerFormComponent;

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
    return this.customerForm?.canDeactivate() || true;
  }

  addCustomer(form) {
    this.subscription.add(
      this.store.dispatch(new AddCustomer(form)).pipe(
        tap((data) => {
          this.customerForm.canDeactivate(true);
          const message = this.translateService.instant('CUSTOMER.Created');
          this.snackBarService.success(message);
          this.store.dispatch(new Navigate([`/${ appRouteNames.CUSTOMERS }`]));
        })
      ).subscribe((data) => {
        },
        error => {
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }
}
