import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  public static readonly TOKEN_KEY = 'token';

  constructor() {}

  /* ***** Public Methods ****** */

  public static getDefaultHeaders(token?: string): HttpHeaders {
    return new HttpHeaders({
      accept: 'application/json',
      Authorization: HelperService.getToken(token),
    });
  }

  public static getHttpParams(object?: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (object) {
      Object.keys(object).forEach((key) => {
        params = params.set(key, object[key]);
      });
    }
    return params;
  }

  /* ***** Private Methods ****** */

  private static getToken(token?: string) {
    if (token === undefined) {
      return (
        'Bearer ' +
        JSON.parse(window.localStorage.getItem(HelperService.TOKEN_KEY)).detail
          .auth_token
      );
    } else {
      return token;
    }
  }
}
