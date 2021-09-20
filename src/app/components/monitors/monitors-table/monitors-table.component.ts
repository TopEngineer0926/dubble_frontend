import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListResponse, TableActionEvent, Media } from '../../../interfaces';
import { Customer } from '../../../interfaces/customer';
import { QueryParams, SortColumn } from '../../../interfaces/base/base-object';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { cols } from 'src/app/constants/monitors.config';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { Product } from '../../../interfaces/product';
import { TableAction } from '../../../constants/table-actions.enum';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../deleteConfirm/delete-confirm-dialog.component';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Monitor } from 'src/app/interfaces/monitor';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-monitors-table',
  templateUrl: './monitors-table.component.html',
  styleUrls: ['./monitors-table.component.scss']
})
export class MonitorsTableComponent implements OnInit, OnDestroy {
  @Input() data: ListResponse<Customer>;
  @Input() showPagination = true;
  @Input() params: QueryParams = { limit: 30, offset: 0, sort_column: SortColumn.CreatedAt, sort_order: 'desc' };
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  readonly cols = cols.map(column => {
    return column
  });
  readonly appRouteNames = appRouteNames;
  dataSource: ListResponse<Product>;
  private subscription = new Subscription();

  currentProduct: { product: Product, media: ListResponse<Media> };
  uploadedVideo: Media[] = new Array(3).fill(null);
  uploadedImage: Media;
  uploadedPdf: Media[] = new Array(3).fill(null);
  productPageLink: string;
  isLoading = false;
  imageToUpload: File;
  protected url: string = environment.apiUrl + 'monitor';

  constructor(private store: Store,
    protected httpClient: HttpClient,
    private snackBarService: SnackBarService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getMonitors(this.params);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
              this.snackBarService.success(message);
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
