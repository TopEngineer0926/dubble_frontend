import { ComponentCanDeactivate } from '../component-can-deactivate';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent, of, Subject, Subscription } from 'rxjs';
import { UnsavedChangesConfirmDialogComponent } from '../../components/dialogs/unsaved-changes-confirm-dialog.component';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export class UnsavedChanges implements ComponentCanDeactivate {
  hasUnsavedChanges = false;
  protected destroyed$ = new Subject();

  private unsavedChangesSubscription: Subscription;

  constructor(protected dialog: MatDialog) {
  }

  canDeactivate(force?: boolean) {
    if (force) {
      this.hasUnsavedChanges = false;
    }
    if (this.hasUnsavedChanges) {
      return this.dialog.open(UnsavedChangesConfirmDialogComponent)
        .afterClosed()
        .pipe(take(1));
    }
    return of(true);
  }

  protected trackChanges(form: FormGroup | FormControl | FormArray) {
    form.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.unsavedChangesSubscription.unsubscribe()),
      )
      .subscribe(() => {
        this.hasUnsavedChanges = form.dirty;
      });
    this.unsavedChangesSubscription = fromEvent(window, 'beforeunload').subscribe(event => {
      return this.hasUnsavedChanges && (event.returnValue = false);
    });
  }

  protected destroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
