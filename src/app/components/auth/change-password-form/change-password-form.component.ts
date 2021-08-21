import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { mustMatch } from '../../../helpers/validators';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnInit {
  @Output() changePwdEvent = new EventEmitter();
  form: FormGroup;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('',
          Validators.compose([Validators.required, Validators.minLength(8)])),
        confirmPassword: new FormControl('', Validators.required),
      }, {validators: mustMatch},
    );
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const formValue = {...this.form.value};
    formValue.currentPassword = this.accountService.hashPassword(this.form.value.currentPassword);
    formValue.newPassword = this.accountService.hashPassword(this.form.value.newPassword);
    this.changePwdEvent.emit(formValue);
  }
}
