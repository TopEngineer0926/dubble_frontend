import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate, ListResponse, Media } from '../../../interfaces';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { Navigate } from '@ngxs/router-plugin';
import { appRouteNames } from '../../../constants/app-route-names';
import {
  DeleteCustomerMedia,
  GetCustomerById,
  SaveCustomerMedia,
  UpdateCustomer
} from '../../../../store/customers/customers.actions';
import { CustomersState } from '../../../../store/customers/customers.state';
import { Customer } from '../../../interfaces/customer';
import { TranslateService } from '@ngx-translate/core';
import { CustomerFormComponent } from '../../../components/customers/customer-form/customer-form.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  currentCustomer: { customer: Customer, media: ListResponse<Media> };

  @ViewChild(CustomerFormComponent) private customerForm: CustomerFormComponent;

  private subscription = new Subscription();

  constructor(private store: Store,
              private route: ActivatedRoute,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.pipe(
        mergeMap((params) => this.store.dispatch(new GetCustomerById(params.id)).pipe(
          switchMap(() => this.store.select(CustomersState.currentCustomer))
          )
        )).subscribe((customer: { customer: Customer, media: ListResponse<Media> }) => {
        this.currentCustomer = customer;
      }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDeactivate() {
    return this.customerForm?.canDeactivate() || true;
  }

  uploadImage(img: File) {
    if (img) {
      this.saveCustomerImg(img);
    } else {
      this.removeCustomerImg();
    }
  }

  editCustomer(form) {
    this.subscription.add(
      this.store.dispatch(new UpdateCustomer(form)).pipe(
        tap((data) => {
          this.customerForm.canDeactivate(true);
          const message = this.translateService.instant('CUSTOMER.Updated');
          this.snackBarService.success(message);
          this.store.dispatch(new Navigate([`/${ appRouteNames.CUSTOMERS }`]));
        })
      ).subscribe((data) => {
        },
        error => {
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }

  saveCustomerImg(img) {
    this.subscription.add(
      this.store.dispatch(new SaveCustomerMedia(this.currentCustomer.customer.itemid, img[0].data))
        .subscribe((data) => {
          },
          error => this.snackBarService.error(error.error?.message || error.message))
    );
  }

  removeCustomerImg() {
    this.subscription.add(
      this.store.dispatch(new DeleteCustomerMedia(this.currentCustomer.media.list[0].itemid))
        .subscribe((data) => {
          },
          error => this.snackBarService.error(error.error?.message || error.message)));
  }

}
