import { TableAction } from './table-actions.enum';

export const cols = [
  { key: 'customer_number', displayKey: 'CUSTOMER.CustomerNumber' },
  { key: 'firstname', displayKey: 'COMMON.FirstName' },
  { key: 'lastname', displayKey: 'COMMON.LastName' },
  // { key: 'email', display: 'Email' },
  { key: 'action1', displayKey: 'COMMON.Edit',
    config: { isAction: true, actions: [{type: TableAction.Edit, displayKey: 'COMMON.Edit'}] }},
  { key: 'action2', displayKey: 'COMMON.Delete',
    config: { isAction: true, actions: [{type: TableAction.Delete, displayKey: 'COMMON.Delete'}] }}
];
