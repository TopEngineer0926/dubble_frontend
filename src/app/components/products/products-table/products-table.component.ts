import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListResponse, TableActionEvent } from '../../../interfaces';
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
import {MatDialog} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../deleteConfirm/delete-confirm-dialog.component';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent implements OnInit, OnDestroy {
  @Input() data: ListResponse<Customer>;
  @Input() showPagination = true;
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
        renderCell: (product: Product) => this.translateService.instant(`PRODUCT.${ product.publication_status }`)
      }
    };
  });
  readonly appRouteNames = appRouteNames;
  dataSource: ListResponse<Product>;
  private subscription = new Subscription();

  currentProduct: { product: Product };

  constructor(private store: Store,
              private translateService: TranslateService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getProducts(this.params);
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
        })).subscribe()
    );
  }

  getProductData(productId: string) {
    this.store.dispatch(new GetProductById(productId))
    .subscribe((data) => {
      switchMap(() => this.store.select(ProductsState.currentProduct)),
      this.currentProduct = data?.products?.currentProduct;
      // Duplicate the current product
      this.addProduct(this.currentProduct.product);
    });
  }

  addProduct(form: Product) {
    this.store.dispatch(new AddProduct(form))
    .subscribe(() => {
      // Refresh the product table
      this.getProducts(this.params);
    })
  }

  duplicateProduct(productId: string): void {
    // Get the product details
    this.getProductData(productId);
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
}
