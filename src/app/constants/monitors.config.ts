import { TableAction } from './table-actions.enum';

export const cols = [
  { key: 'internalPageTitle', displayKey: 'MONITOR.INTERNAL_PAGE_TITLE' },
  { key: 'sender', displayKey: 'MONITOR.CONTACT' },
  { key: 'receiver', displayKey: 'MONITOR.CUSTOMER' },
  { key: 'email', displayKey: 'COMMON.Email' },
  { key: 'phone', displayKey: 'COMMON.PhoneNumber' },
  { key: 'sendingDate', displayKey: 'MONITOR.SENDING_DATE_TIME' },
  { key: 'sentStatus', displayKey: 'MONITOR.STATUS' },
  { 
    key: 'action', displayKey: 'COMMON.Delete',
    config: { isAction: true, actions: [{ type: TableAction.Delete, displayKey: 'COMMON.Delete' }], isMonitor: true }
  }
];
