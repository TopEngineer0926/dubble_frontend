import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DetailResponse, ListResponse, Media } from '../../app/interfaces';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { MediaService } from '../../app/services/media.service';
import { Product } from '../../app/interfaces/product';
import { ProductsService } from '../../app/services/products.service';
import {
  AddProduct,
  DeleteProductById,
  DeleteProductMedia,
  GetProductById,
  GetProducts,
  SaveProductMedia,
  SendProductLinkBy,
  UpdateMedia,
  UpdateProduct
} from './products.actions';
import { SortColumn } from '../../app/interfaces/base/base-object';


export class ProductsStateModel {
  products: ListResponse<Product>;
  currentProduct: {
    product: Product;
    media: ListResponse<Media>;
  };
}

@State<ProductsStateModel>({
  name: 'products',
  defaults: new ProductsStateModel()
})
@Injectable()
export class ProductsState {

  constructor(
    private store: Store,
    private productsService: ProductsService,
    private mediaService: MediaService
  ) {
  }

  @Selector()
  static productsList(state: ProductsStateModel): ListResponse<Product> {
    return state.products;
  }

  @Selector()
  static currentProduct(state: ProductsStateModel): { product: Product, media: ListResponse<Media> } {
    return state.currentProduct;
  }

  @Action(GetProducts)
  getProducts(ctx: StateContext<ProductsStateModel>, { query }: GetProducts): Observable<ListResponse<Product>> {
    return this.productsService.getProducts(query).pipe(
      tap((response: ListResponse<Product>) => {
        const state = { ...ctx.getState() };
        state.products = response;
        ctx.patchState(state);
      }));
  }

  @Action(GetProductById)
  getProductById(ctx: StateContext<ProductsStateModel>, { id }: GetProductById): Observable<any> {
    return combineLatest([
      this.productsService.getById(id),
      this.mediaService.getById('product', id, { limit: 7, offset: 0, sort_column: SortColumn.Order })]).pipe(
      tap(([{ detail }, media]) => {
        let state = { ...ctx.getState() };
        state = {
          ...state,
          currentProduct: {
            product: detail,
            media
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(AddProduct)
  addProduct(ctx: StateContext<ProductsStateModel>, { payload }: AddProduct): Observable<DetailResponse<Product>> {
    return this.productsService.addProduct(payload).pipe(
      tap(({ detail }: DetailResponse<Product>) => {
        let state = { ...ctx.getState() };
        state = {
          ...state,
          currentProduct: {
            product: detail,
            media: null
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(SendProductLinkBy)
  sendProductBy(ctx: StateContext<ProductsStateModel>, { id, type }: SendProductLinkBy): Observable<any> {
    return this.productsService.sendProductLinkBy(id, type);
  }

  @Action(UpdateProduct)
  updateProduct(ctx: StateContext<ProductsStateModel>, { payload }: UpdateProduct): Observable<DetailResponse<Product>> {
    return this.productsService.updateProduct(payload).pipe(
      tap(({ detail }: DetailResponse<Product>) => {

        let state = { ...ctx.getState() };
        state = {
          ...state,
          currentProduct: {
            product: detail,
            media: state.currentProduct.media
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(DeleteProductById)
  deleteProductById(ctx: StateContext<ProductsStateModel>, { id }: DeleteProductById): Observable<DetailResponse<Product>> {
    return this.productsService.deleteById(id).pipe(
      tap(({ detail }: DetailResponse<Product>) => {
        let state = { ...ctx.getState() };
        state = {
          ...state,
          currentProduct: {
            product: detail,
            media: null
          }
        };
        ctx.patchState(state);
      }));
  }

  @Action(SaveProductMedia)
  saveUserMedia(ctx: StateContext<ProductsStateModel>, { id, file }: SaveProductMedia): Observable<Media> {
    return this.mediaService.upload('product', id, file).pipe(
      tap((response: Media) => {
        const state = { ...ctx.getState() };
        state.currentProduct = { ...state.currentProduct };
        state.currentProduct.media = {
          ...state.currentProduct.media,
          list: [...(state.currentProduct.media?.list || []), response]
        };

        ctx.patchState(state);
      }));
  }

  @Action(UpdateMedia)
  updateMediaTitle(ctx: StateContext<ProductsStateModel>, { options: {id, title, order} }: UpdateMedia): Observable<Media> {
    return this.mediaService.updateTitle({id, title, order}).pipe(
      tap((response: Media) => {
        const state = { ...ctx.getState() };
        state.currentProduct = { ...state.currentProduct };
        const list = [...state.currentProduct.media.list];
        const index = state.currentProduct.media.list.findIndex(({ itemid }) => itemid === id);
        list.splice(index, 1, response);
        state.currentProduct.media = {
          ...state.currentProduct.media,
          list
        };

        ctx.patchState(state);
      }));
  }

  @Action(DeleteProductMedia)
  deleteUserMedia(ctx: StateContext<ProductsStateModel>, { id }: DeleteProductMedia): Observable<Media> {
    return this.mediaService.deleteMedia('product', id).pipe(
      tap((response: Media) => {
        const state = { ...ctx.getState() };
        state.currentProduct = { ...state.currentProduct };
        let media = state.currentProduct.media.list;
        media = media.filter(img => img.itemid !== id);
        state.currentProduct.media = {
          ...state.currentProduct.media,
          list: media
        };
        ctx.patchState(state);
      }));
  }
}
