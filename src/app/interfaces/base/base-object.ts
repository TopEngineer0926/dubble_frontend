export interface BaseObject {
  itemid?: string;
  type?: number;
}

export interface QueryParams {
  limit: number;
  offset: number;
  sort_column?: SortColumn;
  sort_order?: 'desc' | 'asc';
}

export enum SortColumn {
  CreatedAt = 'createdAt',
  Order = 'order',
  SendingDate = 'sendingDate'
}

export enum ModelNames {
  ACCOUNT = 'account',
  CONTACT = 'contact',
  PRODUCT = 'product'
}
