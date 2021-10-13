import { TableAction } from './table-actions.enum';

export const cols = [
  {
    key: 'created_at', displayKey: 'PRODUCT.CreationDate',
    config: {
      isDate: true,
      format: 'yyyy-MM-dd HH:mm'
    }
  },
  { key: 'internalPageTitle', displayKey: 'MONITOR.INTERNAL_PAGE_TITLE',
    config: { isAction: true, actions: [{ type: TableAction.LINK_TO_PRODUCT, displayKey: 'MONITOR.INTERNAL_PAGE_TITLE' }], isTemplate: true }
  },
  {
    key: 'contact', displayKey: 'PRODUCT.Contact',
    config: { isNameTemplate: true, value: ['firstname', 'lastname'] }
  },
  {
    key: 'action4', displayKey: 'PRODUCT.PublishPage',
    config: { isAction: true, actions: [{ type: TableAction.PublishPage, displayKey: 'PRODUCT.PublishPage' }] }
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
