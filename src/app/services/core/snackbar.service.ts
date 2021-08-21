import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  // milliseconds
  private readonly duration: number = 5000;

  constructor(public snackBar: MatSnackBar) {}

  /**
   * Show snack-bar with custom styles.
   * @param message - message of snack-bar.
   * @param className - name of class for snack-bar styling.
   * @param action - name of name of button which closes snack-bar.
   * @param duration - duration for showing snack-bar.
   */
  private openSnackBar(
    message: string,
    className: string,
    action?: string,
    duration?: number
  ) {
    this.snackBar.open(message, action, {
      duration,
      panelClass: [className],
      horizontalPosition: 'right',
    });
  }

  /**
   * Show snack-bar with success styles.
   *
   * @param message message for snack-bar.
   * @param action (name of button which closes snack-bar),
   * @param duration of showing snack-bar
   * if it is null then we this.duration(milliseconds) for showing snack-bar.
   */
  success(message: string, action?: string, duration: number = this.duration) {
    this.openSnackBar(
      message,
      'snack-bar-success',
      action,
      action ? null : duration
    );
  }

  /**
   * Show snack-bar with primary styles.
   *
   * @param message message for snack-bar.
   * @param action - name of button which closes snack-bar,
   * @param duration of showing snack-bar
   * if it is null then we this.duration(milliseconds) for showing snack-bar.
   */
  primary(message: string, action?: string, duration: number = this.duration) {
    this.openSnackBar(
      message,
      'snack-bar-primary',
      action,
      action ? null : duration
    );
  }

  /**
   * Show snack-bar with warning styles.
   *
   * @param message - message for snack-bar
   * @param action - name of button which closes snack-bar,
   * @param duration of showing snack-bar
   * if it is null then we this.duration(milliseconds) for showing snack-bar.
   */
  warn(message: string, action?: string, duration: number = this.duration) {
    this.openSnackBar(
      message,
      'snack-bar-warn',
      action,
      action ? null : duration
    );
  }

  /**
   * Show snack-bar with error styles.
   *
   * @param message - message for snack-bar
   * @param action - name of button which closes snack-bar,
   * @param duration of showing snack-bar
   * if it is null then we this.duration(milliseconds) for showing snack-bar.
   */
  error(message: string, action?: string, duration: number = this.duration) {
    this.openSnackBar(
      message,
      'snack-bar-error',
      action,
      action ? null : duration
    );
  }

  /**
   * Show snack-bar with default styles.
   *
   * @param message message for snack-bar.
   * @param action - name of button which closes snack-bar,
   * @param duration of showing snack-bar
   * if it is null then we this.duration(milliseconds) for showing snack-bar.
   */
  default(message: string, action?: string, duration: number = this.duration) {
    this.openSnackBar(message, '', action, action ? null : duration);
  }
}
