import {BaseObject} from './base/base-object';

export interface Customer extends BaseObject{
  customer_number: string;
  academic_degree_preceding: string;
  academic_degree_subsequent: string;
  email: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  category: string;
}
