import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../../services/account.service';
import {filter, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {appRouteNames} from '../../../constants/app-route-names';
import {SnackBarService} from '../../../services/core/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  passwordResetCode: string;

  private subscription = new Subscription();

  constructor(private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBarService: SnackBarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.pipe(
        filter((res => res.passwordResetCode)),
      ).subscribe(({passwordResetCode}) => {
          this.passwordResetCode = passwordResetCode;
        },
        error => {
          this.snackBarService.error(error.error?.message || error.message);
          this.router.navigate([`/${appRouteNames.LOGIN}`]);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  resetPassword(form) {
    form.passwordResetCode = this.passwordResetCode;
    this.subscription.add(
    this.accountService.updatePassword(form).subscribe((data) => {
        this.router.navigate([`/${appRouteNames.LOGIN}`]);
      },
      error => {
        this.snackBarService.error(error.error?.message || error.message);
        this.router.navigate([`/${appRouteNames.LOGIN}`]);
      }));
  }
}
