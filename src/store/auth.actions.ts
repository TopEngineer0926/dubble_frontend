import { LoginRequest, User } from '../app/interfaces';
import { QueryParams } from '../app/interfaces/base/base-object';

export class Logout {
  static readonly type = '[App] Logout';
}

export class Login {
  static readonly type = '[App] Login';

  constructor(public payload: LoginRequest) {
  }
}

export class UpdateUser {
  static readonly type = '[App] UpdateUser';

  constructor(public payload: User) {
  }
}

export class GetUserMedia {
  static readonly type = '[App] GetUserMedia';

  constructor(public id: string, public query?: QueryParams) {
  }
}

export class SaveUserMedia {
  static readonly type = '[App] SaveUserMedia';

  constructor(public id: string, public file: any) {
  }
}
export class DeleteUserMedia {
  static readonly type = '[App] DeleteUserMedia';

  constructor(public id: string) {
  }
}
