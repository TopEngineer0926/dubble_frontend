import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mustMatch } from '../../../helpers/validators';
import {AccountService} from '../../../services/account.service';
@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit, OnDestroy {
  @Output() submitEvent = new EventEmitter();
  form: FormGroup;
  token: string;

  private subscription = new Subscription();

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    this.form = new FormGroup({
        newPassword: new FormControl('',
          Validators.compose([Validators.required, Validators.minLength(8)])),
        confirmPassword: new FormControl('', Validators.required),
        passwordResetCode: new FormControl(''),
        itemid: new FormControl(''),
        type: new FormControl(0),
      }, {validators: mustMatch},
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const hashedPassword = this.accountService.hashPassword(this.form.value.newPassword);
    this.form.value.newPassword =  hashedPassword;
    this.submitEvent.emit(this.form.value);
  }
}
