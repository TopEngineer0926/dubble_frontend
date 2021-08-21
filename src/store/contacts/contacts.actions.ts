import {Contact} from '../../app/interfaces';

export class GetContacts {
  static readonly type = '[Contacts] GetContacts';

  constructor(public query?: any) {
  }
}

export class GetContactById {
  static readonly type = '[Contacts] GetContactById';

  constructor(public id: string) {
  }
}
export class AddContact {
  static readonly type = '[Contacts] AddContact';

  constructor(public payload: Contact) {
  }
}

export class UpdateContact {
  static readonly type = '[Contacts] UpdateContact';

  constructor(public payload: Contact) {
  }
}
export class SaveContactMedia {
  static readonly type = '[Contacts] SaveContactMedia';

  constructor(public id: string, public file: any) {
  }
}

export class DeleteContactMedia {
  static readonly type = '[Contacts] DeleteContactMedia';

  constructor(public id: string) {
  }
}
