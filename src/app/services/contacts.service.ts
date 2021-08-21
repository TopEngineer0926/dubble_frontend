import { Injectable } from '@angular/core';
import { CrudService } from './generic/crud.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, DetailResponse, ListResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends CrudService {

  protected url = environment.apiUrl + 'contact';

  constructor(protected httpClient: HttpClient,
              ) {
    super(httpClient);
  }

 getContacts(params): Observable<ListResponse<Contact>> {
   return this.findAll(this.url, params);
 }

 addContact(payload: Contact): Observable<DetailResponse<Contact>> {
    return this.save(this.url, payload);
 }

 updateContact(payload: Contact): Observable<DetailResponse<Contact>> {
    return this.update(this.url, payload);
 }
 getById(id): Observable<DetailResponse<Contact>> {
    return this.findOne(this.url, id);
 }
}
