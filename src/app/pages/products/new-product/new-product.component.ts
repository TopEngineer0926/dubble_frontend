import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { MediaService } from '../../../services/media.service';
import { AddProduct, SaveProductMedia, UpdateProduct } from '../../../../store/products/products.actions';
import { TranslateService } from '@ngx-translate/core';
import { ComponentCanDeactivate, Product, PublicationStatus, ExtendedFileUploadEvent } from '../../../interfaces';
import { ProductFormComponent } from '../../../components/products/product-form/product-form.component';


@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  readonly appRouteNames = appRouteNames;
  imageToUpload: File;
  pdfsToUpload: ExtendedFileUploadEvent[] = new Array(3).fill(null);
  videosToUpload: ExtendedFileUploadEvent[] = new Array(3).fill(null);
  isLoading = false;
  product: Product;

  @ViewChild(ProductFormComponent) private productForm: ProductFormComponent;

  private subscription = new Subscription();

  constructor(private store: Store,
              private mediaService: MediaService,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDeactivate() {
    return this.productForm?.canDeactivate() || true;
  }

  addProduct(form: Product) {
    if (!this.imageToUpload && form.publication_status === PublicationStatus.published) {
      const message = this.translateService.instant('PRODUCT.TeaserImageMissing');
      this.snackBarService.error(message);
      return;
    }
    this.isLoading = true;
    const action = this.product ? this.store.dispatch(new UpdateProduct(form)) : this.store.dispatch(new AddProduct(form));
    this.subscription.add(
      action.pipe(
        tap(data => {
          this.product = data.products.currentProduct.product;
        }),
        switchMap(data => {
          const productId = data.products.currentProduct.product.itemid;
          const videoUploadRequests = this.videosToUpload
            .map((video, index) =>
              this.store.dispatch(new SaveProductMedia(productId, { ...video, order: index })));
          const pdfUploadRequests = this.pdfsToUpload
            .map(pdf =>
              this.store.dispatch(new SaveProductMedia(productId, pdf)));
          return forkJoin([
            this.store.dispatch(new SaveProductMedia(productId, this.imageToUpload)),
            ...videoUploadRequests,
            ...pdfUploadRequests
          ]);
        }),
        tap(() => {
          this.productForm.canDeactivate(true);
          const message = this.translateService.instant('PRODUCT.Created');
          this.snackBarService.success(message);
          this.store.dispatch(new Navigate([`/${ appRouteNames.PRODUCTS }/${ this.product.itemid }/${ appRouteNames.DETAIL }`]));
        })
      ).subscribe(() => {
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          if (this.product) {
            this.productForm.canDeactivate(true);
            this.store.dispatch(new Navigate([`/${ appRouteNames.PRODUCTS }/${ this.product.itemid }/${ appRouteNames.DETAIL }`]));
          }
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }

  uploadImage(files) {
    this.imageToUpload = files[0].data;
  }

  uploadPdf(file: ExtendedFileUploadEvent, index) {
    this.pdfsToUpload.splice(index, 1, file);
  }

  uploadVideo(videoUpload: ExtendedFileUploadEvent, index) {
    this.videosToUpload.splice(index, 1, videoUpload);
  }
}
