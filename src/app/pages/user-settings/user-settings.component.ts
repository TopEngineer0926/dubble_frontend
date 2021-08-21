import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';

import { Logout, UpdateUser } from '../../../store/auth.actions';
import { SnackBarService } from '../../services/core/snackbar.service';
import { ComponentCanDeactivate, ListResponse, Media, User } from '../../interfaces';
import { UserState } from '../../../store/auth.state';
import { AccountService } from '../../services/account.service';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { appRouteNames } from 'src/app/constants/app-route-names';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  user: User = this.store.selectSnapshot<User>(UserState.user);
  logo: Media;
  userEmail: string;
  appRouteNames = appRouteNames;
  private subscription = new Subscription();

  constructor(private store: Store,
              private accountService: AccountService,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.userEmail = this.user?.email;
    this.subscription.add(
      this.store.select<ListResponse<Media>>(UserState.media).subscribe(media => this.logo = media?.list[0]));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDeactivate() {
    const hasAllDataRequired = Boolean(this.logo && this.user?.main_color && this.user.secondary_color);
    if (!hasAllDataRequired) {
      const warning = this.translateService.instant(`SETTINGS.MissingRequiredFields`);
      this.snackBarService.error(warning);
    }
    return hasAllDataRequired;
  }

  saveSettings(form): void {
    this.subscription.add(
      this.store.dispatch(new UpdateUser(form)).pipe(
        tap((data) => {
          if (this.userEmail !== data.auth.user.email) {
            const warning = this.translateService.instant(`SETTINGS.EmailUpdatedWarning`);
            this.snackBarService.warn(warning);
            return this.store.dispatch(new Logout());
          }
          const message = this.translateService.instant(`SETTINGS.UserUpdated`);
          this.snackBarService.success(message);
        })
      ).subscribe((data) => {
          this.user = form;
        },
        error => {
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }

  changeUserPwd(event) {
    this.subscription.add(
      this.accountService.changePassword({ newPassword: event.newPassword, currentPassword: event.currentPassword })
        .subscribe(data => {
            const message = this.translateService.instant(`SETTINGS.PasswordChanged`);
            this.snackBarService.success(message);
          },
          error => {
            this.snackBarService.error(error.error?.message || error.error);
          }));
  }
}
