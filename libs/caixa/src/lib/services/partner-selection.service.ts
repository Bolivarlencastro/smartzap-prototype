import { Injectable } from '@angular/core';
import { CaixaApi, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PartnerSelectionDialogComponent } from '../containers/partner-selection-dialog/partner-selection-dialog.component';

@Injectable({ providedIn: 'root' })
export class PartnerSelectionService {
  private dialogRef: MatDialogRef<PartnerSelectionDialogComponent>;

  constructor(
    private readonly http: CaixaApi,
    private readonly dialog: MatDialog,
  ) {}

  openDialog() {
    this.dialogRef = this.dialog.open(PartnerSelectionDialogComponent, {
      autoFocus: 'first-tabbable',
      panelClass: 'register-dialog-container',
      backdropClass: 'cx-dialog-overlay',
      disableClose: true,
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  searchPartner(search: string, partnerType: PartnerType) {
    return this.http.searchPartner(search, partnerType);
  }
}
