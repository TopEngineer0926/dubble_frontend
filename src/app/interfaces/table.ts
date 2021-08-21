import { TableAction } from '../constants/table-actions.enum';

export interface TableActionEvent<T = any> {
  item: T;
  action: TableAction;
}
