import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mustMatch } from '../../../helpers/validators';
import {AccountService} from '../../../services/account.service';
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  @Output() submitEvent = new EventEmitter();

  registrationForm: FormGroup;

  constructor( private accountService: AccountService ) {
  }

  registration(): void {
    if (this.registrationForm.invalid) {
      return;
    }
    delete this.registrationForm.value.confirmPassword;
    const hashedPassword = this.accountService.hashPassword(this.registrationForm.value.password);
    this.registrationForm.value.password =  hashedPassword;
    this.submitEvent.emit(this.registrationForm.value);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.registrationForm = new FormGroup({
        firstname: new FormControl('', Validators.required),
        lastname: new FormControl('', Validators.required),
        company_name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('',  [Validators.compose([Validators.required, Validators.minLength(8)])]),
        confirmPassword: new FormControl('', Validators.required),
        type: new FormControl(1, )
      }, {validators: mustMatch}
    );
  }
}
