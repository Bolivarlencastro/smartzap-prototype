import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CertificateCreatePreviewComponent } from '../certificate-create-preview/certificate-create-preview.component';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'kp-certificate-dialog-preview',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, CertificateCreatePreviewComponent],
  template: `
    <kp-certificate-preview
      [certificate]="data"
      [backgroundImageSrc]="data.backgroundImage"
      [logoImageSrc]="data.brandImage"
    ></kp-certificate-preview>
    <button class="absolute right-2 top-2 bg-black bg-opacity-25" mat-dialog-close mat-icon-button>
      <mat-icon class="text-on-primary">close</mat-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatePreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CustomCertificateDto) {
    this.data = { ...data, displayBrand: !!data.brandImage };
  }
}
