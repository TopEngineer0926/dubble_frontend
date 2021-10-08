import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ListResponse, TableActionEvent } from '../../../interfaces';
import { QueryParams, SortColumn } from '../../../interfaces/base/base-object';
import { MatPaginator } from '@angular/material/paginator';
import { cols } from 'src/app/constants/monitors.config';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { TableAction } from '../../../constants/table-actions.enum';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../deleteConfirm/delete-confirm-dialog.component';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Monitor } from 'src/app/interfaces/monitor';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-monitors-table',
  templateUrl: './monitors-table.component.html',
  styleUrls: ['./monitors-table.component.scss']
})
export class MonitorsTableComponent implements OnInit {
  @Input() data: ListResponse<Monitor>;
  @Input() showPagination = true;
  @Input() params: QueryParams = { limit: 30, offset: 0, sort_column: SortColumn.SendingDate, sort_order: 'desc' };
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  readonly cols = cols.map(column => {
    return column
  });
  readonly appRouteNames = appRouteNames;
  dataSource: ListResponse<Monitor>;

  protected url: string = environment.apiUrl + 'monitor';

  constructor(private store: Store,
    protected httpClient: HttpClient,
    private translateService: TranslateService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getMonitors(this.params);
  }

  onActionHandler(event: TableActionEvent<Monitor>): void {
    const { item: monitor, action } = event;
    if (action == TableAction.Delete) {
      this.deleteMonitor(monitor.id, monitor.jobId, monitor.jobGroup);
    } else if (action == TableAction.LINK_TO_PRODUCT) {
      this.store.dispatch(new Navigate([`/${ appRouteNames.PRODUCTS }/${ monitor.productId }/${ appRouteNames.DETAIL }`]));
    }
  }

  onPageUpdate(event): void {
    this.getMonitors({ ...this.params, limit: 30, offset: event.pageIndex * 30 });
  }

  getMonitors(query): void {
    this.httpClient.get<ListResponse<any>>(this.url, {
      params: query,
    })
    .subscribe((monitors) => {
      this.dataSource = monitors;
    },
    error => {
        // this.snackBarService.error(error.error?.message || error.message)
    });
  }

  deleteMonitor(monitorId: number, jobId: string, jobGroup: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let url = `${ this.url }/${ monitorId }`;
        this.httpClient.delete(url)
        .subscribe(() => {
          // Delete the scheduled jobs
          var data = {
            jobId: jobId,
            jobGroup: jobGroup
          }
          var delteJobUrl = environment.apiUrl + 'schedule/deleteJob';
          this.httpClient.post(delteJobUrl, data)
          .subscribe(({isSuccess, message}: any) => {
              var msg = this.translateService.instant('MONITOR.DELETE_SUCCESS_MSG')
              this.snackBarService.success(msg);
          },
          error => {
              this.snackBarService.error(error.error?.message || error.message)
          });
          this.getMonitors(this.params);
        });
      }
    });
  }
}
