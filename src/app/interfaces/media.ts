import { BaseObject, ModelNames } from './base/base-object';
import { MediaType } from '../constants/media-type.enum';

export interface Media extends BaseObject {
  model_id: string;
  model_name: ModelNames;
  media_type: MediaType;
  url: string;
  title: string;
  order: number;
}

export interface UpdateMediaOptions {
  id: string;
  title?: string;
  order?: number;
}
