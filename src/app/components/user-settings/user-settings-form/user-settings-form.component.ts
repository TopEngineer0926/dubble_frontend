import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../interfaces/user.model';
import { NgxMatColorPickerInput, Color } from '@angular-material-components/color-picker';
import { hexToRgb } from '../../../helpers/form-helper';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  styleUrls: ['./user-settings-form.component.scss']
})
export class UserSettingsFormComponent implements OnInit {
  @Input() user: User;

  @Output() submitEvent = new EventEmitter();

  @ViewChild('picker1') picker1: NgxMatColorPickerInput;
  @ViewChild('picker2') picker2: NgxMatColorPickerInput;
  @ViewChild('fileInput') fileInput: ElementRef;
  userSettingsForm: FormGroup;
  color: ThemePalette = 'accent';
  touchUi = false;
  logoPositions = [
    { value: 'left', labelKey: 'POSITION.Left' },
    { value: 'center', labelKey: 'POSITION.Center' },
    { value: 'right', labelKey: 'POSITION.Right' }
  ];
  buttonColors = [
    { value: '#000000', labelKey: 'PRODUCT.ButtonColor.Black' },
    { value: '#ffffff', labelKey: 'PRODUCT.ButtonColor.White' },
  ];

  constructor() { }

  ngOnInit(): void {
    const color1 = this.user.main_color ? hexToRgb(this.user.main_color) : '';
    const color2 = this.user.secondary_color ? hexToRgb(this.user.secondary_color) : '';

    this.initForm(this.user, color1, color2);
  }

  initForm(user, color1, color2) {
    this.userSettingsForm = new FormGroup({
      firstname: new FormControl(user.firstname, Validators.required),
      lastname: new FormControl(user.lastname, Validators.required),
      company_name: new FormControl(user.company_name, Validators.required),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      main_color: new FormControl(color1 ? new Color(color1.r, color1.g, color1.b) : null),
      secondary_color: new FormControl(color2 ? new Color(color2.r, color2.g, color2.b) : null),
      contact_button_color: new FormControl(user.contact_button_color || '#000000'),
      logo_position: new FormControl(user.logo_position || 'left'),
    });
  }

  updateSettings() {
    if (this.userSettingsForm.invalid) {
      return;
    }
    const formValue = {...this.userSettingsForm.value};
    formValue.main_color = this.userSettingsForm.value.main_color
      ? this.createHex(this.userSettingsForm.value.main_color) : null;
    formValue.secondary_color = this.userSettingsForm.value.secondary_color
      ? this.createHex(this.userSettingsForm.value.secondary_color) : null;
    this.submitEvent.emit(formValue);
  }

  createHex(color: Color){
   return `#${color?.hex}`;
  }
}
