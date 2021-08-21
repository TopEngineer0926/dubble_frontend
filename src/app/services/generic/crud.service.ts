import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { HelperService } from '../core/helper.service';
import { ListResponse } from '../../interfaces/response';


@Injectable({
  providedIn: 'root',
})
export abstract class CrudService {
  // must be set in the child-service
  protected url: string;

  // define custom header for api requests (can be extended in the child-service)
  /*protected jsonHeaders = {
    headers: HelperService?.getDefaultHeaders(),
  };*/

  protected constructor(protected httpClient: HttpClient) {}

  /* ***** GET methods ***** */

  /**
   * Find one by item id.
   *
   * @param url API url
   * @param itemId id of the searching entity.
   * @param params query params
   *
   * @return found entity response object.
   */
  findOne(url: string, itemId: string, params?): Observable<any> {
    return this.httpClient.get<ListResponse<any>>(
      `${url}/${itemId}`,  {params: {...params}}
     // this.jsonHeaders
    );
  }

  /**
   * Get all records.
   *
   * @param url API url
   * @param searchParams searching query params object.
   * @return object with a list of objects of found records.
   */
  findAll(url, searchParams?): Observable<ListResponse<any>> {
    // const httpParams = HelperService.getHttpParams(searchParams);
    return this.httpClient.get<ListResponse<any>>(url, {
      params: searchParams,
      // headers: this.jsonHeaders.headers,
    });
  }

  /* ***** POST methods ***** */

  /**
   * Save new entity or edit existing (if id of the existing entity is valid and was set).
   *
   * @param url API url
   * @param body object of saving entity.
   * @return mapped response object of saved entity.
   */
  save(url, body: any): Observable<any> {

    return this.httpClient.post<any>(url, body);
  }


  /* ***** PUT methods ***** */

  /**
   * Update existing entity (if id of the existing entity is valid and was set).
   *
   * @param url API url
   * @param body object of updating entity.
   * @return mapped response object of saved entity.
   */
  update(url, body: any): Observable<any> {

    return this.httpClient.put<any>(url, body);
  }

  /* ***** DELETE methods ***** */

  /**
   * Delete entity by url.
   *
   * @param url API url
   * @return detailed response.
   */
  delete(url: string): Observable<any> {
    return this.httpClient.delete<any>(url);
  }

  /**
   * Delete entities by bodies.
   *
   * @param body of deleting entity.
   * @return detailed response.
   */
  deleteAll(body: any[]): Observable<void> {
    return this.httpClient.request<void>('delete', this.url, {
      body,
    //  headers: this.jsonHeaders.headers,
    });
  }
}
