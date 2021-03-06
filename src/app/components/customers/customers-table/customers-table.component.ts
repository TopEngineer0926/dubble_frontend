import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListResponse, TableActionEvent } from '../../../interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';

import { Customer } from '../../../interfaces/customer';
import { cols } from 'src/app/constants/customers.config';
import { DeleteCustomerById, GetCustomers } from '../../../../store/customers/customers.actions';
import { CustomersState } from '../../../../store/customers/customers.state';
import { QueryParams, SortColumn} from '../../../interfaces/base/base-object';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { TableAction } from '../../../constants/table-actions.enum';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../deleteConfirm/delete-confirm-dialog.component';
import { LocalStorageService } from '../../../services/core/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.scss']
})
export class CustomersTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: ListResponse<Customer>;
  @Input() showPagination = true;
  @Input() showFilter = false;
  @Input() params: QueryParams;
  @Input() deleteOption = false;
  @Input() updateTable;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  readonly cols = cols;
  readonly appRouteNames = appRouteNames;
  dataSource: ListResponse<Customer>;
  filteredDataSource: ListResponse<Customer>;
  searchControl = new FormControl('');

  private currentPageNum = 0;
  private subscription = new Subscription();

  public selectedCategory: string = "";
  public categoryList: Array<string> = [];
  protected categoryUrl = environment.apiUrl + 'customer/customer_by_filter';
  protected categoryListUrl = environment.apiUrl + 'account/category';
  public disabledDeleteBtn = true;

  constructor(private store: Store,
    public dialog: MatDialog,
    protected httpClient: HttpClient,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.getCustomers(this.params ? this.params : { limit: 2000, offset: 0, sort_column: SortColumn.CreatedAt, sort_order: 'desc' });
    this.searchControl.valueChanges.pipe(
      startWith(''),
      filter(() => this.showFilter)
    )
      .subscribe((searchValue) => {
        this.selectedCategory = ""
        if (!searchValue) {
          this.getCustomers(this.params ? this.params : { limit: 2000, offset: 0, sort_column: SortColumn.CreatedAt, sort_order: 'desc' });
        } else {
          this.filteredDataSource = {
            ...this.dataSource,
            list: this.dataSource.list
              .filter((item) =>
                Object.values(item)
                  .some(value => String(value).toLowerCase().includes(searchValue.toLowerCase())))
          };
        }
      });

    this.getCategory()  
    // const category_data = this.localStorageService.get('category-list');
    // category_data?.map((d) => {
    //   this.categoryList.push(d.name);
    // })
  }

  ngOnChanges(): void {
    this.getCategory()
    this.getCustomers(this.params ? this.params : { limit: 2000, offset: this.currentPageNum * 10, sort_column: SortColumn.CreatedAt, sort_order: 'desc' });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onActionHandler(event: TableActionEvent<Customer>): void {
    const { item: customer, action } = event;
    if (action === TableAction.Edit) {
      this.store.dispatch(new Navigate([appRouteNames.CUSTOMERS, customer.itemid, appRouteNames.DETAIL]));
    } else if (action === TableAction.Delete) {
      this.deleteCustomer(customer.itemid);
    }
  }

  onPageUpdate(event): void {
    this.currentPageNum = event.pageIndex;
    this.getCustomers(this.params ? this.params : { limit: 2000, offset: event.pageIndex * 10, sort_column: SortColumn.CreatedAt, sort_order: 'desc' });
  }

  getCustomers(query: QueryParams): void {
    this.subscription.add(
      this.store.dispatch(new GetCustomers(query)).pipe(
        switchMap(() => this.store.select(CustomersState.customersList)),
      ).subscribe((contacts) => {
        this.dataSource = contacts;
        this.filteredDataSource = contacts;
      })
    );
  }

  getCategory() {
    this.httpClient.get<any>(this.categoryListUrl)
    .subscribe((response) => {
        this.categoryList = [];
        if (response.result) {
            var data: Array<any> = response.result.split("|");
            data = data?.filter((d) => d != "");
            data?.map((d) => {
                this.categoryList.push(d);
            })
        }
    },
    error => {
        this.snackBarService.error(error.error?.message || error.message)
    });
  }

  deleteCustomer(customerId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new DeleteCustomerById(customerId)).subscribe(
          () => {
            this.searchControl.setValue('', {emitEvent: false});
            this.selectedCategory = "";
            this.getCustomers(this.params ? this.params : { limit: 2000, offset: this.currentPageNum * 10, sort_column: SortColumn.CreatedAt, sort_order: 'desc' });
          });
      }
    });
  }


  handleChangeCategory(value: string): void {
    this.searchControl.setValue('', {emitEvent: false});
    if (!value) {
      this.getCustomers(this.params ? this.params : { limit: 2000, offset: this.currentPageNum * 10, sort_column: SortColumn.CreatedAt, sort_order: 'desc' });
      this.disabledDeleteBtn = true;
    } else {
      this.disabledDeleteBtn = false;
      this.getCustomersByFilter(value);
    }
  }

  getCustomersByFilter(filter) {
    this.httpClient.get<ListResponse<Customer>>(this.categoryUrl, {
      params: {
        limit: "2000",
        offset: "0",
        filter: "|" + filter + "|"
      },
    })
    .subscribe((contacts) => {
      this.dataSource = contacts;
      this.filteredDataSource = contacts;
    },
    error => {
      this.snackBarService.error(error.error?.message || error.message)
    });
  }

  deleteSelectedCustomers() {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpClient.delete<any>(this.categoryUrl, {
          params: {
            filter: "|" + this.selectedCategory + "|"
          }
        })
        .subscribe(() => {
          this.searchControl.setValue('', {emitEvent: false});
          this.selectedCategory = "";
          this.getCustomers(this.params ? this.params : { limit: 2000, offset: this.currentPageNum * 10, sort_column: SortColumn.CreatedAt, sort_order: 'desc' });
          const message = this.translateService.instant("CUSTOMER.DELETE_SUCCESS");
          this.snackBarService.success(message);
        },
        error => {
          const message = this.translateService.instant("CUSTOMER.DELETE_FAIL");
          this.snackBarService.error(message);
        });
      }
    });
  }
}
