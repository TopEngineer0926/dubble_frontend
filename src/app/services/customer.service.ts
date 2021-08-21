import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailResponse, ListResponse } from '../interfaces';
import { CrudService } from './generic/crud.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends CrudService {

protected url = environment.apiUrl + 'customer';

  constructor(protected httpClient: HttpClient){
    super(httpClient); }

  getCustomers(params): Observable<ListResponse<Customer>> {
    return this.findAll(this.url, params);
  }

  addCustomer(payload: Customer): Observable<DetailResponse<Customer>> {
    return this.save(this.url, payload);
  }

  updateCustomer(payload: Customer): Observable<DetailResponse<Customer>> {
    return this.update(this.url, payload);
  }
  getById(id): Observable<DetailResponse<Customer>> {
    return this.findOne(this.url, id);
  }
  deleteById(id): Observable<DetailResponse<Customer>> {
    return this.delete(`${this.url}/${id}`);
  }
}
