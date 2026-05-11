import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CertificateCreatePreviewComponent } from '../certificate-create-preview/certificate-create-preview.component';

@Component({
  selector: 'kp-certificate-dialog-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
})
export class CertificatePreviewDialogComponent {
  protected readonly data: CustomCertificateDto;

  constructor() {
    const raw = inject<CustomCertificateDto>(MAT_DIALOG_DATA);
    this.data = { ...raw, displayBrand: !!raw.brandImage };
  }
}
