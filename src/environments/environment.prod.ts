import { DynamicEnvironment } from './dynamic-enviroments';
class Enviroment {
  public production: boolean;
  public appVersion: string;
  // tslint:disable-next-line:variable-name
  public apiUrl: string;
  // tslint:disable-next-line:variable-name
  public webUrl: string;
  constructor() {

    this.appVersion = require('../../package.json').version;
    this.production = true;
    this.apiUrl = 'https://dev7api.dubble.at/api/v1/';
    this.webUrl = 'https://dev7go.dubble.at/';
  }
}
export const environment = new Enviroment();
