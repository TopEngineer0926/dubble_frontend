import { Product } from '../../app/interfaces/product';
import { UpdateMediaOptions } from '../../app/interfaces';

export class GetProducts {
  static readonly type = '[Products] GetProducts';

  constructor(public query?: any) {
  }
}

export class GetProductById {
  static readonly type = '[Products] GetProductById';

  constructor(public id: string) {
  }
}

export class SendProductLinkBy {
  static readonly type = '[Products] SendProductBy';

  constructor(public id: string, public type: 'sms' | 'email') {
  }
}

export class AddProduct {
  static readonly type = '[Products] AddProduct';

  constructor(public payload: Product) {
  }
}

export class UpdateProduct {
  static readonly type = '[Products] UpdateProduct';

  constructor(public payload: Product) {
  }
}

export class DeleteProductById {
  static readonly type = '[Products] DeleteProductById';

  constructor(public id: string) {
  }
}

export class SaveProductMedia {
  static readonly type = '[Products] SaveProductMedia';

  constructor(public id: string, public file: any) {
  }
}

export class UpdateMedia {
  static readonly type = '[Products] UpdateMedia';

  constructor(public options: UpdateMediaOptions) {
  }
}

export class DeleteProductMedia {
  static readonly type = '[Product] DeleteProductMedia';

  constructor(public id: string) {
  }
}
