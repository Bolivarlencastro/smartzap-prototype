import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CUSTOM_CERTIFICATE_DEFAULT_IMAGES } from '../../certificate-constants';

@Component({
  selector: 'kp-certificate-preview',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './certificate-create-preview.component.html',
  styles: `
    .background-image-container {
      background-size: 100%;
      background-repeat: no-repeat;
    }
  `,
})
export class CertificateCreatePreviewComponent {
  @Input() certificate: CustomCertificateDto;
  @Input() backgroundImageSrc: string;
  @Input() logoImageSrc: string;
  @Input() creationScreen = false;

  get displayVisibleData(): boolean {
    return (
      this.certificate?.displayPerformance ||
      this.certificate?.displayTotalTime ||
      this.certificate?.displayConclusionDate
    );
  }

  getBackgroundImageSrc() {
    if (this.backgroundImageSrc) {
      return this.backgroundImageSrc;
    }

    return CUSTOM_CERTIFICATE_DEFAULT_IMAGES[this.certificate?.orientation];
  }
}
