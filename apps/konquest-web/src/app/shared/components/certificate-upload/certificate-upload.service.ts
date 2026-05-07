import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { Observable } from 'rxjs';
import { CertificateUploadDialogComponent } from './containers';

@Injectable({
  providedIn: 'root',
})
export class CertificateUploadService {
  constructor(
    private _missionService: MissionServiceV2,
    private _dialog: MatDialog,
  ) {}

  private _dialogRef: MatDialogRef<CertificateUploadDialogComponent>;

  openDialog(): void {
    this._dialogRef = this._dialog.open(CertificateUploadDialogComponent, {
      maxWidth: 400,
      minWidth: 300,
      disableClose: true,
      restoreFocus: false,
      autoFocus: 'dialog',
    });
  }

  closeDialog(): void {
    this._dialogRef?.close();
  }

  loadCertificateHistory(enrollmentId: string): Observable<string> {
    return this._missionService.loadHistory(enrollmentId);
  }

  submitCertificate(enrollmentId: string, certificate: File) {
    return this._missionService.submitCertificate(enrollmentId, certificate);
  }
}
