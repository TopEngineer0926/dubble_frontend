import { Component, OnDestroy, OnInit } from '@angular/core';

import { AccountService } from '../../../services/account.service';
import { Subscription } from 'rxjs';

import { SnackBarService } from '../../../services/core/snackbar.service';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  readonly appRouteNames = appRouteNames;
  isEmailSent = false;

  private subscription = new Subscription();
  constructor(private accountService: AccountService,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  sendEmail(form) {
    this.subscription.add(
      this.accountService.resetPassword(form).subscribe(data => {
        this.isEmailSent = true;
      },
        error => {
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }
}
