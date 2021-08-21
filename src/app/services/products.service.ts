import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailResponse, ListResponse } from '../interfaces';
import { CrudService } from './generic/crud.service';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends CrudService {

  protected url = environment.apiUrl + 'product';

  constructor(protected httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  getProducts(params): Observable<ListResponse<Product>> {
    return this.findAll(this.url, params);
  }

  addProduct(payload: Product): Observable<DetailResponse<Product>> {
    return this.save(this.url, payload);
  }

  updateProduct(payload: Product): Observable<DetailResponse<Product>> {
    return this.update(this.url, payload);
  }

  getById(id): Observable<DetailResponse<Product>> {
    return this.findOne(this.url, id);
  }

  sendProductLinkBy(id: string, type: 'sms' | 'email'): Observable<any> {
    return this.save(`${this.url}/${id}/notification/${type}`, {});
  }

  deleteById(id): Observable<DetailResponse<Product>> {
    const url = `${ this.url }/${ id }`;
    return this.delete(url);
  }

}
