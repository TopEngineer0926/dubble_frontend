import { Component } from '@angular/core';

@Component({
  selector: 'app-browser-not-supported',
  templateUrl: './browser-not-supported.component.html',
  styleUrls: ['./browser-not-supported.component.scss'],
})
export class BrowserNotSupportedComponent {
  showWarning = false;

  constructor() {
    this.showWarning = BrowserNotSupportedComponent.detectIE();
  }

  private static detectIE(): boolean {
    // logic from https://codepen.io/gapcode/pen/vEJNZN
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older
      return true;
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11
      return true;
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) (not Chromium)
      return true;
    }

    // other browser
    return false;
  }

}
