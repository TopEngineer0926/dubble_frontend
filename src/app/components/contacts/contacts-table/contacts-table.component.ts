import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Contact, ListResponse, TableActionEvent } from '../../../interfaces';
import { TableAction } from '../../../constants/table-actions.enum';
import { GetContacts } from '../../../../store/contacts/contacts.actions';
import { switchMap, tap } from 'rxjs/operators';
import { ContactsState } from '../../../../store/contacts/contacts.state';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { cols } from '../../../constants/contacts.config';
import { Navigate } from '@ngxs/router-plugin';
import { QueryParams, SortColumn } from '../../../interfaces/base/base-object';
import { appRouteNames } from '../../../constants/app-route-names';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.scss']
})
export class ContactsTableComponent implements OnInit, OnDestroy {
  @Input() data: ListResponse<Contact>;
  @Input() showPagination = true;
  @Input() params: QueryParams = { limit: 2000, offset: 0, sort_column: SortColumn.CreatedAt, sort_order: "desc" };
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  readonly cols = cols;
  readonly appRouteNames = appRouteNames;
  dataSource: ListResponse<Contact>;
  pageType = "contact"
  private subscription = new Subscription();

  protected inviteUrl = environment.apiUrl + 'account/invite/';

  constructor(private store: Store, 
    private snackBarService: SnackBarService,
    protected httpClient: HttpClient,
    private translateService: TranslateService,) {
  }

  ngOnInit(): void {
    this.getContacts(this.params);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onActionHandler(event: TableActionEvent<Contact>): void {
    const { item: contact, action } = event;

    if (action == TableAction.Invite) {
      console.log(contact)
      const message = this.translateService.instant(`EMPLOYEE.INVITE_SENT`)
      const messageNoLogo = this.translateService.instant(`EMPLOYEE.INVITE_SENT_NO_MASTER_LOGO`)
      this.httpClient.get<any>(this.inviteUrl + contact.itemid)
      .subscribe((response) => {
        this.getContacts(this.params);
        if (response.result == "No Logo") {
          this.snackBarService.success(messageNoLogo);
        } else {
          this.snackBarService.success(message);
        }
      },
      error => {
          this.snackBarService.error(error.error?.message || error.message)
      });
    } else {
      this.store.dispatch(new Navigate([appRouteNames.CONTACTS, contact.itemid, appRouteNames.DETAIL]));
    }
  }

  onPageUpdate(event): void {
    // this.getContacts({ limit: 10000, offset: event.pageIndex * 10 });
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
