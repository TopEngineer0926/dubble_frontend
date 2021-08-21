import {AbstractControl, FormArray, FormGroup, ValidationErrors} from '@angular/forms';


export function mustMatch(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('password') || control.get('newPassword');
  const repeatedPassword = control.get('confirmPassword');

  if (repeatedPassword.errors && !repeatedPassword.errors.mustMatch) {
    return {mustMatch: true};
  }
  if (newPassword.value !== repeatedPassword.value) {
    repeatedPassword.setErrors({mustMatch: true});
    return {mustMatch: true};
  } else {
    repeatedPassword.setErrors(null);
    return null;
  }
}
