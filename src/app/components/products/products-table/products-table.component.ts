import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListResponse, TableActionEvent, Media } from '../../../interfaces';
import { Customer } from '../../../interfaces/customer';
import { QueryParams, SortColumn } from '../../../interfaces/base/base-object';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { switchMap, tap } from 'rxjs/operators';
import { cols } from 'src/app/constants/products.config';
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
import { LocalStorageService } from '../../../services/core/local-storage.service';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { FormControl } from '@angular/forms';
import { filter, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent implements OnInit, OnDestroy {
  @Input() data: ListResponse<Customer>;
  @Input() showPagination = true;
  @Input() showFilter = false;
  @Input() params: QueryParams = { limit: 10, offset: 0, sort_column: SortColumn.CreatedAt, sort_order: 'desc' };
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  readonly cols = cols.map(column => {
    if (!column?.config?.customRenderer) {
      return column;
    }
    return {
      ...column,
      config: {
        ...column.config,
        renderCell: (product: Product) => this.translateService.instant(`PRODUCT.${product.publication_status}`)
      }
    };
  });
  readonly appRouteNames = appRouteNames;
  dataSource: ListResponse<Product>;
  filteredDataSource: ListResponse<Product>;
  searchCustomerControl = new FormControl('');
  searchContactControl = new FormControl('');
  pageSizeOptions = this.params.limit
  
  private subscription = new Subscription();

  currentProduct: { product: Product, media: ListResponse<Media> };
  uploadedVideo: Media[] = new Array(3).fill(null);
  uploadedImage: Media;
  uploadedPdf: Media[] = new Array(3).fill(null);
  productPageLink: string;
  isLoading = false;
  imageToUpload: File;
  protected url = environment.apiUrl + 'product/media/duplicate';

  public selectedTemplate: string = "";
  public templateList: Array<string> = [];
  protected templateUrl = environment.apiUrl + 'product/product_by_filter';

  constructor(private store: Store,
    protected httpClient: HttpClient,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getProducts(this.params);
    this.searchCustomerControl.valueChanges.pipe(
      startWith(''),
      filter(() => this.showFilter)
    )
    .subscribe((searchValue) => {
      this.searchContactControl.setValue('', {emitEvent: false});
      this.selectedTemplate = "";

      if (!searchValue) {
        this.getProducts(this.params);
      } else {
        this.filteredDataSource = {
          ...this.dataSource,
          list: this.dataSource.list
            .filter((item) => 
              item.customer && (String(item.customer.firstname) + " " + String(item.customer.lastname)).toLowerCase().includes(searchValue.toLowerCase())
            )
        };
      }
    });

    this.searchContactControl.valueChanges.pipe(
      startWith(''),
      filter(() => this.showFilter)
    )
    .subscribe((searchValue) => {
      this.searchCustomerControl.setValue('', {emitEvent: false});
      this.selectedTemplate = "";

      if (!searchValue) {
        this.getProducts(this.params);
      } else {
        this.filteredDataSource = {
          ...this.dataSource,
          list: this.dataSource.list
            .filter((item) => 
              item.contact && (String(item.contact.firstname) + " " + String(item.contact.lastname)).toLowerCase().includes(searchValue.toLowerCase())
            )
        };
      }
    });

    const template_data = this.localStorageService.get('template-list');
    template_data?.map((d) => {
      if (d.name != "Vorlage")
        this.templateList.push(d.name);
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onActionHandler(event: TableActionEvent<Product>): void {
    const { item: product, action } = event;
    if (action == TableAction.Delete) {
      this.deleteProduct(product.itemid);
    }
    else if (action == TableAction.Duplicate) {
      this.duplicateProduct(product.itemid);
    }
    else if (action == TableAction.Edit) {
      this.store.dispatch(new Navigate([appRouteNames.PRODUCTS, product.itemid, appRouteNames.DETAIL]));
    }
  }

  onPageUpdate(event): void {
    this.getProducts({ ...this.params, limit: 10, offset: event.pageIndex * 10 });
  }

  getProducts(query: QueryParams): void {
    this.subscription.add(
      this.store.dispatch(new GetProducts(query)).pipe(
        switchMap(() => this.store.select(ProductsState.productsList)),
        tap((products) => {
          this.dataSource = products;
          this.filteredDataSource = this.dataSource;
        })).subscribe()
    );
  }

  duplicateProduct(productId: string): void {
    this.store.dispatch(new GetProductById(productId))
      .subscribe((data) => {
        switchMap(() => this.store.select(ProductsState.currentProduct)),
          this.currentProduct = data?.products?.currentProduct;
        const product = this.currentProduct;
        // Duplicate the current product
        var domain = environment.webUrl;
        if (product.product.customer && product.product.customer.domain_name)
          domain = `https://${product.product.customer.domain_name}/`;

        this.productPageLink = `${domain}${product.product.share_code}`;
        this.uploadedVideo = product.media?.list.filter(({ media_type }) => media_type && media_type === MediaType.Video);
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
        this.getProducts(this.params);
      });
  }

  deleteProduct(productId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new DeleteProductById(productId)).subscribe(() => this.getProducts(this.params));
      }
    });
  }

  handleChangeTemplate(value: string): void {
    this.searchCustomerControl.setValue('', {emitEvent: false});
    this.searchContactControl.setValue('', {emitEvent: false});
    if (!value) {
      this.getProducts(this.params);
    } else {
      this.getProductsByFilter(value);
    }
  }

  getProductsByFilter(filter) {
    this.httpClient.get<ListResponse<Product>>(this.templateUrl, {
      params: {
        limit: "10",
        offset: "0",
        filter: "|" + filter + "|"
      },
    })
    .subscribe((products) => {
      this.dataSource = products;
      this.filteredDataSource = products;
    },
    error => {
      this.snackBarService.error(error.error?.message || error.message)
    });
  }
}
