import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  CustomCertificateDto,
  CustomCertificatesApi,
  CustomCertificatesFilter,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { CertificateImageDefinition } from '../model';

@Injectable({ providedIn: 'root' })
export class CustomCertificatesService {
  private dialogRef: MatDialogRef<unknown>;
  private backgroundImageFile: File | undefined;
  private brandImageFile: File | undefined;

  constructor(
    private readonly dialog: MatDialog,
    private readonly customCertificatesApi: CustomCertificatesApi,
  ) {}

  saveCertificate(certificateId: string | undefined, certificate: CustomCertificateDto) {
    const backgroundImage = this.backgroundImageFile;
    const brandImage = this.brandImageFile;

    if (certificateId) {
      return this.customCertificatesApi.update(certificateId, certificate, backgroundImage, brandImage);
    }

    return this.customCertificatesApi.create(certificate, backgroundImage, brandImage);
  }

  loadCertificates(filter: CustomCertificatesFilter) {
    return this.customCertificatesApi.list(filter);
  }

  deleteCertificate(certificateId: string) {
    return this.customCertificatesApi.delete(certificateId);
  }

  toggleDefaultCertificate(certificateId: string) {
    return this.customCertificatesApi.toggleDefault(certificateId);
  }

  openDeleteDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = 'CUSTOM_CERTIFICATES.DELETE_CONFIRMATION.TITLE';
    dialogRef.componentInstance.confirmMessage = 'CUSTOM_CERTIFICATES.DELETE_CONFIRMATION.MESSAGE';
    return dialogRef.afterClosed();
  }

  openNewCertificateDialog() {
    this.resetImages();

    return new Observable((observer) => {
      import('../containers/new-certificate-dialog.component').then(({ NewCertificateDialogComponent }) => {
        this.dialogRef = this.dialog.open(NewCertificateDialogComponent, {
          autoFocus: 'dialog',
          width: '560px',
          disableClose: true,
        });
        this.dialogRef.afterClosed().subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      });
    });
  }

  openCertificatePreview(certificate: CustomCertificateDto) {
    import('../components/certificate-preview-dialog/certificate-preview-dialog.component').then(
      ({ CertificatePreviewDialogComponent }) => {
        this.dialog.open(CertificatePreviewDialogComponent, {
          autoFocus: 'dialog',
          width: certificate.orientation === 'portrait' ? '850px' : '700px',
          data: certificate,
        });
      },
    );
  }

  closeDialog() {
    this.dialogRef?.close();
    this.resetImages();
  }

  setFile(file: File, imageDefinition: CertificateImageDefinition) {
    if (imageDefinition === 'backgroundImage') {
      this.backgroundImageFile = file;
    } else {
      this.brandImageFile = file;
    }
  }

  private resetImages() {
    this.backgroundImageFile = undefined;
    this.brandImageFile = undefined;
  }
}
