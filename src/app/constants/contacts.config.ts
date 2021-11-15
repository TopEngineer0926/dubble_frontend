import { TableAction } from './table-actions.enum';

export const cols = [
  {
    key: 'abbreviation',
    displayKey: 'CONTACT.Abbreviation'
  },
  { key: 'firstname', displayKey: 'COMMON.FirstName' },
  { key: 'lastname', displayKey: 'COMMON.LastName' },
  // { key: 'email', display: 'Email' },
  // { key: 'phone_number', display: 'Phone number' },
  {
    key: 'action', displayKey: 'COMMON.Edit',
    config: { isAction: true, actions: [{type: TableAction.Edit, displayKey: 'COMMON.Edit'}] }
  },
  {
    key: 'action1', displayKey: 'COMMON.Invite',
    config: { isAction: true, actions: [{type: TableAction.Invite, displayKey: 'COMMON.Invite'}] }
  }
];
