import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule } from '@jsverse/transloco';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CertificateCreateFormComponent, CertificateImageEvent } from '../components';
import { NewCertificateDialogFacade } from '../facades';
import { Observable } from 'rxjs';

@Component({
  selector: 'kp-certificates-dialog',
  template: `
    <div mat-dialog-title>
      <p class="text-2xl mb-4">{{ 'CUSTOM_CERTIFICATES.CREATE_DIALOG.DIALOG_TITLE' | transloco }}</p>
      <p class="text-sm break-words">{{ 'CUSTOM_CERTIFICATES.CREATE_DIALOG.DIALOG_SUBTITLE' | transloco }}</p>
    </div>
    <kp-certificate-create-form
      (formSubmit)="saveCertificate($event)"
      (saveImage)="saveImage($event)"
      [certificate]="certificate$ | async"
      [isSaving]="isSaving$ | async"
    ></kp-certificate-create-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    TranslocoModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    CertificateCreateFormComponent,
  ],
})
export class NewCertificateDialogComponent {
  protected readonly certificate$: Observable<CustomCertificateDto>;
  protected readonly isSaving$: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<NewCertificateDialogComponent>,
    private newCertificateDialogFacade: NewCertificateDialogFacade,
  ) {
    this.certificate$ = newCertificateDialogFacade.certificate$;
    this.isSaving$ = newCertificateDialogFacade.isSaving$;
  }

  saveCertificate(certificateDto: CustomCertificateDto): void {
    this.newCertificateDialogFacade.saveCertificate(certificateDto);
  }

  saveImage(event: CertificateImageEvent) {
    const { image, imageDef } = event;
    this.newCertificateDialogFacade.uploadImage(image, imageDef);
  }
}
