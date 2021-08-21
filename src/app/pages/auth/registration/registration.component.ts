import { Component, OnDestroy, OnInit } from '@angular/core';
import { appRouteNames } from 'src/app/constants/app-route-names';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../../../services/core/snackbar.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  readonly appRouteNames = appRouteNames;
  isRegistered = false;

  private subscription = new Subscription();

  constructor(private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBarService: SnackBarService) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.pipe(
        filter((res => res.activationCode)),
        switchMap((activationCode => {
          return this.accountService.activate(activationCode.activationCode);
        }))
      ).subscribe(res => {
          this.router.navigate([`/${ appRouteNames.LOGIN }`]);
        },
        error => {
          this.isRegistered = false;
          this.snackBarService.error(error.error?.message || error.message);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  registration(form) {
    this.subscription.add(
      this.accountService.saveUser(form).subscribe(data => {
          this.isRegistered = true;
        },
        error => {
          this.snackBarService.error(error.error?.message || error.message);
        }));
  }
}
