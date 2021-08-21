import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent implements OnInit {
  @Output() submitEvent = new EventEmitter();
  form: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      itemid: new FormControl(''),
      type:  new FormControl(0)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitEvent.emit(this.form.value);
  }

}
