import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  CustomCertificateDto,
  CustomCertificatesApi,
  CustomCertificatesFilter,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { NewCertificateDialogComponent } from '../containers/new-certificate-dialog.component';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { CertificatePreviewDialogComponent } from '../components';
import { CertificateImageDefinition } from '../models/certificate-image-definition';

@Injectable({ providedIn: 'root' })
export class CustomCertificatesService {
  private dialogRef: MatDialogRef<NewCertificateDialogComponent>;
  private backgroundImageFile: File | undefined;
  private brandImageFile: File | undefined;

  constructor(
    private dialog: MatDialog,
    private customCertificatesApi: CustomCertificatesApi,
  ) {}

  saveCertificate(certificateId: string, certificate: CustomCertificateDto) {
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

  openDeleteDialog(): Observable<any> {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = marker('CUSTOM_CERTIFICATES.DELETE_CONFIRMATION.TITLE');
    dialogRef.componentInstance.confirmMessage = marker('CUSTOM_CERTIFICATES.DELETE_CONFIRMATION.MESSAGE');

    return dialogRef.afterClosed();
  }

  openNewCertificateDialog() {
    this.resetImages();

    this.dialogRef = this.dialog.open<NewCertificateDialogComponent>(NewCertificateDialogComponent, {
      autoFocus: 'dialog',
      width: '560px',
      disableClose: true,
    });

    return this.dialogRef.afterClosed();
  }

  openCertificatePreview(certificate: CustomCertificateDto) {
    this.dialog.open(CertificatePreviewDialogComponent, {
      autoFocus: 'dialog',
      width: certificate.orientation === 'portrait' ? '850px' : '700px',
      data: certificate,
    });
  }

  closeDialog(): void {
    this.dialogRef?.close();
    this.resetImages();
  }

  vinculateCertificate(certificateId: string, learnContentId: string) {
    return this.customCertificatesApi.vinculateLearnContent({ certificateId, learnContentId });
  }

  desvinculateCertificate(learnContentId: string) {
    return this.customCertificatesApi.desvinculateLearnContent(learnContentId);
  }

  loadLearnContentCertificate(learnContentId: string) {
    return this.customCertificatesApi.getLearnContentCertificate(learnContentId);
  }

  setFile(file: File, imageDefinition: CertificateImageDefinition) {
    if (imageDefinition === 'backgroundImage') {
      this.backgroundImageFile = file;
      return;
    }

    this.brandImageFile = file;
  }

  private resetImages() {
    this.backgroundImageFile = undefined;
    this.brandImageFile = undefined;
  }
}
