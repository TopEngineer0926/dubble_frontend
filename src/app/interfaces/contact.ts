import { BaseObject } from './base/base-object';

export interface Contact extends BaseObject {
  email: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  abbreviation: string;
}
