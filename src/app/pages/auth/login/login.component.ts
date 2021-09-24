import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { appRouteNames } from 'src/app/constants/app-route-names';
import { AccountService } from '../../../services/account.service';
import { GetUserMedia, Login } from '../../../../store/auth.actions';
import { SnackBarService } from '../../../services/core/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../../../app/services/core/local-storage.service';

export interface Category {
  name: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  readonly appRouteNames = appRouteNames;
  private subscription = new Subscription();
  categoryList: Category[] = [];
  protected categoryUrl = environment.apiUrl + 'account/category';

  constructor(private accountService: AccountService,
              private router: Router,
              private store: Store,
              private snackBarService: SnackBarService,
              private translateService: TranslateService,
              protected httpClient: HttpClient,
              private localStorageService: LocalStorageService
  ) {
  }

  login(form): void {
    this.subscription.add(
      this.store.dispatch(new Login(form)).pipe(
        switchMap(({ auth }) => {
          const query = { limit: 1, offset: 0 };
          return this.store.dispatch((new GetUserMedia(auth.user.itemid, query)))
            .pipe(map(({ auth: authState }) => {
              const logo = authState?.media?.list?.length && authState.media.list[0];
              return { user: auth?.user, logo };
            }));
        })
      ).subscribe(({ user, logo }) => {
          this.getCategory();
          if (logo && user?.main_color && user?.secondary_color) {
            this.store.dispatch(new Navigate([`/`]));
          } else {
            this.store.dispatch(new Navigate([`/`, appRouteNames.USER_SETTINGS]));
          }
        },
        error => {
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCategory() {
    this.httpClient.get<any>(this.categoryUrl)
    .subscribe((response) => {
        this.categoryList = [];
        if (response.result) {
            var data = response.result.split("|");
            data.map((d) => {
                this.categoryList.push({name: d});
            })
        }
        this.localStorageService.set('category-list', this.categoryList);
    },
    error => {
        this.snackBarService.error(error.error?.message || error.message)
    });
}
}
