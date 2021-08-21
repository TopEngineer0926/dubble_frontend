import {BaseObject} from './base/base-object';
import { User} from './user.model';

export interface DetailResponse<T> {
  detail: T;
}

export interface ListResponse<T> {
  list: Array<T>;
  overallsize: number;
  offset: number;
  limit: number;
}

export interface UserResponse extends BaseObject {
    token?: string;
    userModel: User;
}


