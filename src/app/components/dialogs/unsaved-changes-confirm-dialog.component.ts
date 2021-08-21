import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unsaved-changes-confirm-dialog',
  templateUrl: `./unsaved-changes-confirm-dialog.component.html`,
  styleUrls: ['./unsaved-changes-confirm-dialog.component.scss']
})
export class UnsavedChangesConfirmDialogComponent {
  message = 'Sie haben nicht gespeicherte Änderungen. Diese gehen verloren, wenn Sie die Seite ohne speichern verlassen.';

  constructor(private dialogRef: MatDialogRef<UnsavedChangesConfirmDialogComponent>) {
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
