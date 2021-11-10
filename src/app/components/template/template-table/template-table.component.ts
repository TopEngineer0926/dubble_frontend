import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListResponse, TableActionEvent, Media, PublicationStatus } from '../../../interfaces';
import { Customer } from '../../../interfaces/customer';
import { QueryParams, SortColumn } from '../../../interfaces/base/base-object';
import { MatPaginator } from '@angular/material/paginator';
import { combineLatest, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { switchMap, tap } from 'rxjs/operators';
import { cols } from 'src/app/constants/template.config';
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
import {
  SaveProductMedia,
  UpdateMedia,
  UpdateProduct
} from '../../../../store/products/products.actions';
import { UpdateCustomer } from '../../../../store/customers/customers.actions';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.scss']
})
export class TemplateTableComponent implements OnInit, OnDestroy {
  @Input() data: ListResponse<Customer>;
  @Input() showPagination = true;
  @Input() showFilter = false;
  @Input() params: QueryParams = { limit: 10, offset: 0, sort_column: SortColumn.CreatedAt, sort_order: 'desc' };
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  readonly cols = cols.map(column => {
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
  
  private subscription = new Subscription();

  currentProduct: { product: Product, media: ListResponse<Media> };
  uploadedVideo: Media[] = new Array(3).fill(null);
  uploadedImage: Media;
  uploadedPdf: Media[] = new Array(3).fill(null);
  productPageLink: string;
  isLoading = false;
  imageToUpload: File;
  protected url = environment.apiUrl + 'product/media/duplicate';
  protected productTemplateUrl = environment.apiUrl + 'account/template';

  public selectedTemplate: string = "";
  public templateList: Array<string> = [];
  protected templateUrl = environment.apiUrl + 'template/template_by_status';
  protected templateByFilterUrl = environment.apiUrl + 'template/template_by_filter';

  pageType = "template"

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
      this.templateList.push(d.name);
    })
    if (this.templateList.indexOf("Vorlage") < 0) {
      this.addVorlageToProductTemplate();
    }
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
      this.store.dispatch(new Navigate([appRouteNames.TEMPLATE, product.itemid, appRouteNames.DETAIL]));
    } else if (action == TableAction.LINK_TO_PRODUCT) {
      this.store.dispatch(new Navigate([`/${ appRouteNames.PRODUCTS }/${ product.itemid }/${ appRouteNames.DETAIL }`]));
    } else if (action == TableAction.PublishPage) {
      this.publishPage(product.itemid);
    }
  }

  onPageUpdate(event): void {
    this.getProducts({ ...this.params, limit: 10, offset: event.pageIndex * 10 });
  }

  getProducts(query: QueryParams): void {
    this.httpClient.get<ListResponse<Product>>(this.templateUrl, {
      params: {
        limit: "10",
        offset: "0"
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
        this.getProducts(this.params);
      });
  }

  publishPage(productId: string): void {
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
        this.updateProduct({...product.product, 
          publication_status: PublicationStatus.published, 
          template: product.product.template.replace("|Vorlage|", "|")
        });
      });
  }

  updateProduct(form: Product) {
    this.store.dispatch(new AddProduct(form)).subscribe(
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
        this.store.dispatch(new Navigate([`/${ appRouteNames.PRODUCTS }/${ productId }/${ appRouteNames.DETAIL }`]));

      });
  }

  private isSameFileUpload(file1, file2): boolean {
    return file1 === file2 || (file1?.file === file2?.file && file1?.title === file2?.title);
  }

  private updateTitleInArray(title: string, index: number, array: Media[]) {
    const file = array[index];
    array[index] = {
      ...file,
      title,
      order: index
    };
    return file;
  }

  saveMediaTitle(file: Media, index: number) {
    this.subscription.add(
      this.store.dispatch(new UpdateMedia({id: file.itemid, title: file.title, order: index}))
        .subscribe((data) => {
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            this.snackBarService.error(error.error?.message || error.message);
          }
        )
    );
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
    this.httpClient.get<ListResponse<Product>>(this.templateByFilterUrl, {
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

  addVorlageToProductTemplate() {
    var body = {
        category: "|" + this.templateList.join("|") + "|Vorlage|"
    }

    this.httpClient.put(`${this.productTemplateUrl}`, body)
    .subscribe(() => {
        this.getProductTemplate();
    },
    error => {
    });
  }

  getProductTemplate() {
    this.httpClient.get<any>(this.productTemplateUrl)
    .subscribe((response) => {
        var tempData = [];
        if (response.result) {
            var data: Array<any> = response.result.split("|");
            data = data?.filter((d) => d != "");
            data?.map((d) => {
              tempData.push({name: d});
            })
        }
        this.localStorageService.set('template-list', tempData);
        this.templateList.push("Vorlage");
    },
    error => {
        this.snackBarService.error(error.error?.message || error.message)
    });
  }
}
