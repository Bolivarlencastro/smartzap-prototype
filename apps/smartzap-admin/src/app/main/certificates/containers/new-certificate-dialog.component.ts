import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import {
  CertificateCreateFormComponent,
  CertificateImageEvent,
} from '../components/certificate-create-form/certificate-create-form.component';
import { NewCertificateDialogFacade } from '../facades/new-certificate-dialog.facade';

@Component({
  selector: 'kp-certificates-dialog',
  providers: [NewCertificateDialogFacade],
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
  imports: [AsyncPipe, TranslocoPipe, MatDialogModule, CertificateCreateFormComponent],
})
export class NewCertificateDialogComponent {
  protected readonly certificate$: Observable<CustomCertificateDto | undefined>;
  protected readonly isSaving$: Observable<boolean>;

  private readonly facade = inject(NewCertificateDialogFacade);

  constructor() {
    this.certificate$ = this.facade.certificate$;
    this.isSaving$ = this.facade.isSaving$;
  }

  saveCertificate(certificate: CustomCertificateDto) {
    this.facade.saveCertificate(certificate);
  }

  saveImage(event: CertificateImageEvent) {
    this.facade.uploadImage(event.image, event.imageDef);
  }
}
