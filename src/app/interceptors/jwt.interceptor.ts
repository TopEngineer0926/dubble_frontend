import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {UserState} from '../../store/auth.state';
import {Logout} from '../../store/auth.actions';
import {LocalStorageService} from '../services/core/local-storage.service';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store: Store,
              private localStorageService: LocalStorageService) {
  }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.store.selectSnapshot(UserState.token);
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      return next.handle(request).pipe(
        catchError(error => this.handleError(request, next, error))
      );

  }

  handleError(request, next, error): Observable<never> {
    if (error.status === 403 || error.status === 401) {
      error.message = 'Authorization failed';
      this.store.reset({});
      this.localStorageService.clear();
    }
    return throwError(error);
  }
}
