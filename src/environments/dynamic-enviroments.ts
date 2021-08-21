declare var window: any;

export class DynamicEnvironment {
  public get api() {
    return window.config.apiUrl;
  }
}
