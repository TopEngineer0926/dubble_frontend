import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { CrudService } from './generic/crud.service';
import { environment } from '../../environments/environment';
import { ListResponse, Media, ExtendedFileUploadEvent, UpdateMediaOptions } from '../interfaces';
import { QueryParams } from '../interfaces/base/base-object';


@Injectable({
  providedIn: 'root'
})
export class MediaService extends CrudService {
  protected url = environment.apiUrl + 'media';

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  getById(model, id, params?: QueryParams): Observable<ListResponse<Media>> {
    const url = `${ this.url }/${ model }`;
    return this.findOne(url, id, params);

  }

  upload(model, id, file: File | ExtendedFileUploadEvent): Observable<Media> {
    let uploadFile: File = (file as ExtendedFileUploadEvent)?.file || file as File;
    const { title, order, file: fileData } = ((file as ExtendedFileUploadEvent) || {});
    let url = `${ this.url }/${ model }/${ id }`;
    if (title?.trim() || order != null) {
      const queryParams = this.getQueryParams({ title, order });

      url += `?${ new URLSearchParams(queryParams).toString() }`;
      uploadFile = fileData;
    }

    if (!uploadFile) {
      return of(null);
    }

    const formData: FormData = new FormData();

    formData.append('file', uploadFile);

    return this.save(url, formData);
  }

  updateTitle({ id, title, order }: UpdateMediaOptions): Observable<Media> {
    const queryParams = this.getQueryParams({ title, order });

    const url = `${ this.url }/${ id }/?${ new URLSearchParams(queryParams).toString() }`;
    return this.update(url, {});
  }

  deleteMedia(model, id): Observable<any> {
    const url = `${ this.url }/${ id }`;
    return this.delete(url);
  }

  private getQueryParams(obj: any) {
    const queryParams = { ...obj };
    Object.keys(queryParams).forEach(key => {
      const value = queryParams[key];
      if (value == null || (typeof value === 'string' && !value.trim())) {
        delete queryParams[key];
      }
    });
    return queryParams;
  }
}
