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
import { QueryParams } from '../../../interfaces/base/base-object';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { TableAction } from '../../../constants/table-actions.enum';
import { FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../deleteConfirm/delete-confirm-dialog.component';

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
  @Input() updateTable;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  readonly cols = cols;
  readonly appRouteNames = appRouteNames;
  dataSource: ListResponse<Customer>;
  filteredDataSource: ListResponse<Customer>;
  searchControl = new FormControl('');

  private currentPageNum = 0;
  private subscription = new Subscription();

  constructor(private store: Store, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getCustomers(this.params? this.params : {limit: 0, offset: 0});
    this.searchControl.valueChanges.pipe(
      startWith(''),
      filter(() => this.showFilter)
    )
      .subscribe((searchValue) => {
        if (!searchValue) {
          this.filteredDataSource = this.dataSource;
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
  }

  ngOnChanges(): void {
    this.getCustomers(this.params ? this.params : { limit: 10, offset: this.currentPageNum * 10 });
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
    this.getCustomers(this.params? this.params : { limit: 10, offset: event.pageIndex * 10 });
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

  deleteCustomer(customerId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new DeleteCustomerById(customerId)).subscribe(
          () => this.getCustomers(this.params? this.params : {limit: 10, offset: this.currentPageNum * 10}));
      }
    });
  }

}