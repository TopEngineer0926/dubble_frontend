import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListResponse, TableActionEvent, Media } from '../../../interfaces';
import { Customer } from '../../../interfaces/customer';
import { QueryParams, SortColumn } from '../../../interfaces/base/base-object';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { switchMap, tap } from 'rxjs/operators';
import { cols } from 'src/app/constants/monitors.config';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { GetProductById, GetProducts, AddProduct, DeleteProductById } from '../../../../store/products/products.actions';
import { ProductsState } from '../../../../store/products/products.state';
import { Product } from '../../../interfaces/product';
import { TranslateService } from '@ngx-translate/core';
import { TableAction } from '../../../constants/table-actions.enum';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../deleteConfirm/delete-confirm-dialog.component';
import { environment } from '../../../../environments/environment';
import { MediaType } from '../../../constants/media-type.enum';
import { HttpClient } from '@angular/common/http';
import { Monitor } from 'src/app/interfaces/monitor';

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
    private translateService: TranslateService,
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
      this.deleteMonitor(monitor.id);
    }
  }

  onPageUpdate(event): void {
    this.getMonitors({ ...this.params, limit: 30, offset: event.pageIndex * 30 });
  }

  getMonitors(query): void {
    // this.subscription.add(
    //   this.store.dispatch(new GetProducts(query)).pipe(
    //     switchMap(() => this.store.select(ProductsState.productsList)),
    //     tap((monitors) => {
    //       this.dataSource = monitors;
    //     })).subscribe()
    // );
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

  duplicateProduct(productId: string): void {
    this.store.dispatch(new GetProductById(productId))
      .subscribe((data) => {
        switchMap(() => this.store.select(ProductsState.currentProduct)),
          this.currentProduct = data?.products?.currentProduct;
        const product = this.currentProduct;
        // Duplicate the current product
        this.productPageLink = `${environment.webUrl}${product.product.share_code}`;
        this.uploadedVideo = product.media?.list.filter(({ media_type }) => media_type && media_type === MediaType.Video);
        this.uploadedVideo?.forEach((item) => this.uploadedVideo.splice(item.order, 1, item));
        this.uploadedImage = product.media?.list.filter(({ media_type }) => media_type && media_type === MediaType.Image)[0];
        this.uploadedPdf = product.media?.list.filter(({ media_type }) => media_type && media_type === MediaType.Pdf);
        this.addProduct();
      });
  }

  addProduct(): void {
    this.store.dispatch(new AddProduct(this.currentProduct.product)).subscribe(
      (data) => {
        const productId = data.products.currentProduct.product.itemid;

        // Duplicate image
        this.httpClient.post(`${this.url}`, JSON.stringify({ ...this.uploadedImage, model_id: productId })).subscribe();

        // Duplicate pdfs
        this.uploadedPdf?.forEach((file: any, index) => {
          if (!file) {
            return;
          }
          this.httpClient.post(`${this.url}`, JSON.stringify({ ...file, model_id: productId })).subscribe()
        });

        // Duplicate videos
        this.uploadedVideo?.forEach((file: any, index) => {
          if (!file) {
            return;
          }
          this.httpClient.post(`${this.url}`, JSON.stringify({ ...file, model_id: productId })).subscribe()
        });

        // Refresh table
        this.getMonitors(this.params);
      });
  }

  deleteMonitor(monitorId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let url = `${ this.url }/${ monitorId }`;
        this.httpClient.delete(url)
        .subscribe(() => {
          this.getMonitors(this.params);
        });
      }
    });
  }
}
