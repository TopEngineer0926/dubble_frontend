import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Store } from '@ngxs/store';
import { UserState } from '../../../store/auth.state';
import { appRouteNames } from 'src/app/constants/app-route-names';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  readonly appRouteNames = appRouteNames;

  constructor(private store: Store,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {

    if (this.store.selectSnapshot(UserState.isLoggedIn)) {
      return true;
    }

    return this.router.parseUrl(`/${appRouteNames.LOGIN}`);
  }
}
