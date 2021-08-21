import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgModel, Validators} from '@angular/forms';

import {Md5} from 'ts-md5/dist/md5';
import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;

  @Output() submitEvent = new EventEmitter();

  constructor(private accountService: AccountService) {
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const hashedPassword = this.accountService.hashPassword(this.loginForm.value.password);
    this.loginForm.value.password =  hashedPassword;
    this.submitEvent.emit(this.loginForm.value);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

}
