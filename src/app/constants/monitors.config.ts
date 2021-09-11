import { TableAction } from './table-actions.enum';

export const cols = [
  {
    key: 'contact', displayKey: 'MONITOR.CONTACT',
    config: { isNameTemplate: true, value: ['firstname', 'lastname'] }
  },
  {
    key: 'sales_manager', displayKey: 'MONITOR.SALES_MANAGER',
    config: { isNameTemplate: true, value: ['firstname', 'lastname'] }
  },
  { key: 'sender_name', displayKey: 'MONITOR.SENDER_NAME' },
  {
    key: 'customer', displayKey: 'MONITOR.CUSTOMER',
    config: { isNameTemplate: true, value: ['firstname', 'lastname'] }
  },
  { key: 'recipient_name', displayKey: 'MONITOR.RECIPIENT_NAME' },
  {
    key: 'sending_date_time', displayKey: 'MONITOR.SENDING_DATE_TIME',
    config: {
      isDate: true,
      format: 'yyyy-MM-dd HH:mm'
    }
  },
  { key: 'sent_status', displayKey: 'MONITOR.SENT_STATUS', config: { customRenderer: true } },
  { key: 'information_page', displayKey: 'MONITOR.INFORMATION_PAGE' },
  {
    key: 'action1', displayKey: 'COMMON.Delete',
    config: { isAction: true, actions: [{ type: TableAction.Delete, displayKey: 'COMMON.Delete' }] }
  }
];
