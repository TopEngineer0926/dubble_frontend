import {Customer} from '../../app/interfaces/customer';


export class GetCustomers {
  static readonly type = '[Customers] GetCustomers';

  constructor(public query?: any) {
  }
}

export class GetCustomerById {
  static readonly type = '[Customers] GetCustomersById';

  constructor(public id: string) {
  }
}

export class AddCustomer {
  static readonly type = '[Customers] AddCustomer';

  constructor(public payload: Customer) {
  }
}

export class UpdateCustomer {
  static readonly type = '[Customers] UpdateCustomer';

  constructor(public payload: Customer) {
  }
}

export class DeleteCustomerById {
  static readonly type = '[Customers] DeleteCustomerById';

  constructor(public id: string) {
  }
}

export class SaveCustomerMedia {
  static readonly type = '[Customers] SaveCustomerMedia';

  constructor(public id: string, public file: any) {
  }
}

export class DeleteCustomerMedia {
  static readonly type = '[Customer] DeleteCustomerMedia';

  constructor(public id: string) {
  }
}
