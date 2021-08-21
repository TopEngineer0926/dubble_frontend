import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Contact, ListResponse, TableActionEvent } from '../../../interfaces';
import { GetContacts } from '../../../../store/contacts/contacts.actions';
import { switchMap, tap } from 'rxjs/operators';
import { ContactsState } from '../../../../store/contacts/contacts.state';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { cols } from '../../../constants/contacts.config';
import { Navigate } from '@ngxs/router-plugin';
import { QueryParams } from '../../../interfaces/base/base-object';
import { appRouteNames } from '../../../constants/app-route-names';


@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.scss']
})
export class ContactsTableComponent implements OnInit, OnDestroy {
  @Input() data: ListResponse<Contact>;
  @Input() showPagination = true;
  @Input() params: QueryParams = { limit: 10, offset: 0 };
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  readonly cols = cols;
  readonly appRouteNames = appRouteNames;
  dataSource: ListResponse<Contact>;

  private subscription = new Subscription();

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.getContacts(this.params);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onActionHandler(event: TableActionEvent<Contact>): void {
    const { item: contact, action } = event;
    this.store.dispatch(new Navigate([appRouteNames.CONTACTS, contact.itemid, appRouteNames.DETAIL]));

  }

  onPageUpdate(event): void {
    this.getContacts({ limit: 10, offset: event.pageIndex * 10 });
  }

  getContacts(query: QueryParams): void {
    this.subscription.add(
      this.store.dispatch(new GetContacts(query)).pipe(
        switchMap(() => this.store.select(ContactsState.contactsList)),
        tap((contacts) => {
          this.dataSource = contacts;
        })).subscribe()
    );
  }
}
