import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '../../interfaces';
import { CanDeactivateGuard } from './can-deactivate.guard';

@Injectable({
  providedIn: 'root'
})
export class SettingsGuard extends CanDeactivateGuard {

  canDeactivate(
    component: ComponentCanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    if (nextState?.url === '/login') {
      return true;
    }
    return super.canDeactivate(component, currentRoute, currentState, nextState);
  }
}
