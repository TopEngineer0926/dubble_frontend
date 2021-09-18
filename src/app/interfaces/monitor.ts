import { BaseObject } from './base/base-object';

export interface Monitor extends BaseObject {
  id: number,
  internalPageTitle: string,
  productId: number,
  contactId: number,
  userId: number,
  customerId: number,
  sender: string,
  receiver: string,
  email: string,
  phone: string,
  sendingDate: string,
  sentStatus: string,
  scheduleStatus: string
}
