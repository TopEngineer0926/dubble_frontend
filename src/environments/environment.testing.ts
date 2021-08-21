import { DynamicEnvironment } from './dynamic-enviroments';
class Enviroment {
  public production: boolean;
  public appVersion: string;
  public apiUrl: string;
  public webUrl: string;
  constructor() {

    this.appVersion = require('../../package.json').version + '-local';
    this.production = false;
    this.apiUrl = 'https://api.dubble.dev.mogree.com/api/v1/';
    this.webUrl = 'https://web.dubble.dev.mogree.com/';
  }
}
export const environment = new Enviroment();
