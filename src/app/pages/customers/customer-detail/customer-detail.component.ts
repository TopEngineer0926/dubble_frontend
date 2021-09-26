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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../../../app/services/core/local-storage.service';

export interface Category {
    name: string;
}

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
    currentCustomer: { customer: Customer, media: ListResponse<Media> };

    @ViewChild(CustomerFormComponent) private customerForm: CustomerFormComponent;

    private subscription = new Subscription();
    categoryList: Category[] = [];
    protected categoryUrl = environment.apiUrl + 'customer/category';
    selectedCategory = [];

    constructor(private store: Store,
        private route: ActivatedRoute,
        private snackBarService: SnackBarService,
        protected httpClient: HttpClient,
        private localStorageService: LocalStorageService,
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
                    
                    // Get the selected category for the current customer
                    this.getCategory();
                }));

        // Load all available category list for the user
        const data = this.localStorageService.get('category-list');
        data.map((d) => {
            this.categoryList.push(d);
        })

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
                    this.store.dispatch(new Navigate([`/${appRouteNames.CUSTOMERS}`]));
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

    saveCategory() {
        var body = {
            category: this.selectedCategory.join("|"),
            id: this.currentCustomer.customer.itemid,
        }

        this.httpClient.put(`${this.categoryUrl}`, body)
        .subscribe(() => {
            this.getCategory();
            const message = this.translateService.instant("CATEGORY.CreatedSuccess");
            this.snackBarService.success(message);
        },
        error => {
            const message = this.translateService.instant("CATEGORY.CreatedFail");
            this.snackBarService.error(message);
        });
    }

    getCategory() {
        this.httpClient.get<any>(this.categoryUrl, {
            params: {
                id: this.currentCustomer.customer.itemid
            },
        })
        .subscribe((response) => {
            this.selectedCategory = [];
            if (response.result) {
                var data = response.result.split("|");
                data.map((d) => {
                    // this.categoryList.push({ name: d });
                    this.selectedCategory.push(d);
                })
            }
        },
        error => {
            this.snackBarService.error(error.error?.message || error.message)
        });
    }
}
