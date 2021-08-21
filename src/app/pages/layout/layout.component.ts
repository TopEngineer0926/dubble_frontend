import {Component, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SnackBarService } from '../../services/core/snackbar.service';
import { Logout } from '../../../store/auth.actions';
import { Navigate } from '@ngxs/router-plugin';
import { appRouteNames } from '../../constants/app-route-names';
import {GetContacts} from '../../../store/contacts/contacts.actions';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy{
  readonly appRouteNames = appRouteNames;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  private subscription = new Subscription();

  constructor(private breakpointObserver: BreakpointObserver,
              private store: Store,
              private snackBarService: SnackBarService) {}

   ngOnDestroy(): void {
    this.subscription.unsubscribe();
   }

  logout() {
    this.subscription.add(this.store.dispatch(new Logout()).subscribe((data) => {
        this.store.dispatch(new Navigate([`/${appRouteNames.LOGIN}`]));
      },
      error => this.snackBarService.error( error.error?.message || error.message)
    ));
  }

}
