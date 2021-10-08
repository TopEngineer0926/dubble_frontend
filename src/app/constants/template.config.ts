import { TableAction } from './table-actions.enum';

export const cols = [
  {
    key: 'created_at', displayKey: 'PRODUCT.CreationDate',
    config: {
      isDate: true,
      format: 'yyyy-MM-dd HH:mm'
    }
  },
  { key: 'internal_page_title', displayKey: 'PRODUCT.Name' },
  {
    key: 'customer', displayKey: 'PRODUCT.Customer',
    config: { isNameTemplate: true, value: ['firstname', 'lastname'] }
  },
  {
    key: 'contact', displayKey: 'PRODUCT.Contact',
    config: { isNameTemplate: true, value: ['firstname', 'lastname'] }
  },
  {
    key: 'action1', displayKey: 'COMMON.Edit',
    config: { isAction: true, actions: [{ type: TableAction.Edit, displayKey: 'COMMON.Edit' }] }
  },
  {
    key: 'action2', displayKey: 'COMMON.Duplicate',
    config: { isAction: true, actions: [{ type: TableAction.Duplicate, displayKey: 'COMMON.Duplicate' }] }
  },
  {
    key: 'action3', displayKey: 'COMMON.Delete',
    config: { isAction: true, actions: [{ type: TableAction.Delete, displayKey: 'COMMON.Delete' }] }
  }
];
