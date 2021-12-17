import {BaseObject} from './base/base-object';

export interface User extends BaseObject {
  firstname: string;
  lastname: string;
  company_name: string;
  email: string;
  mail_headline: string;
  mail_textline: string;
  main_color?: string;
  secondary_color?: string;
  password?: string;
  contact_button_color: string;
  logo_position: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
