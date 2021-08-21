import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailResponse, UserResponse, User } from '../interfaces';
import { CrudService } from './generic/crud.service';
import { Store } from '@ngxs/store';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends CrudService {

  protected url = environment.apiUrl + 'account';

  constructor(protected httpClient: HttpClient,
              private store: Store) {
    super(httpClient);
  }

  saveUser(payload: User): Observable<User> {
    return this.save(this.url, payload);
   // return this.httpClient.post<User>(this.url, payload);
  }
  updateUser(payload: User): Observable<DetailResponse<User>> {
    return this.update(this.url, payload);
  }

  activate(activationCode): Observable<any> {
    return this.httpClient.put(this.url + '/activate', {}, {params: {activationCode}});
  }

  login({email, password}): Observable<DetailResponse<UserResponse>> {
    const headers = new HttpHeaders({
      'mogree-Mail': email,
      'mogree-Password': password
    });
    return this.httpClient.put<DetailResponse<UserResponse>>(this.url + '/login', {}, {headers});
  }

  logout() {
    return this.httpClient.delete(this.url + '/logout');
  }

  resetPassword(payload): Observable<any> {
    return this.httpClient.put(this.url + '/password/reset', payload);
  }

  updatePassword(payload): Observable<any> {
    return this.httpClient.put(this.url + '/password/reset/update', payload);
  }

  hashPassword(password) {
    return Md5.hashStr(password);
  }

  changePassword({newPassword, currentPassword}) {
    const headers = new HttpHeaders({
      'mogree-Password': newPassword,
      'mogree-Password-old': currentPassword
    });
    return this.httpClient.put(this.url + '/password', {}, {headers});
  }
}
