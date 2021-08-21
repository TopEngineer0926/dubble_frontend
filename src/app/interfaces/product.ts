import { BaseObject } from './base/base-object';
import { Contact } from './contact';
import { Customer } from './customer';

export interface Product extends BaseObject {
  contact: Contact;
  custom_text: string;
  customer: Customer;
  greeting: string;
  headline: string;
  press_info_section_name: string;
  press_infos: Array<CustomSection>;
  publication_status: PublicationStatus;
  review_section_name: string;
  reviews: Array<CustomSection>;
  share_code: string;
  user_id: number;
  internal_page_title: string;
  video_section_headline: string;
  created_at: Date | string;
}

export interface CustomSection extends BaseObject {
  button_text: string;
  head_line: string;
  custom_text: string;
  link: string;
}

export enum PublicationStatus {
  draft = 'DRAFT',
  published = 'PUBLISHED'
}
