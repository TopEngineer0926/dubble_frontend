import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss']
})
export class DeleteConfirmDialogComponent {
  disabledBtn: boolean = true;

  constructor(private dialogRef: MatDialogRef<DeleteConfirmDialogComponent>) {
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  handleChange(event: Event): void {
    if ((event.target as HTMLInputElement).value === "OK") {
      this.disabledBtn = false;
    } else {
      this.disabledBtn = true;
    }
  }
}
