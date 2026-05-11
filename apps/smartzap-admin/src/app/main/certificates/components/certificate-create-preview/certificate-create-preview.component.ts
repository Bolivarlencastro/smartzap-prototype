import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';

const DEFAULT_IMAGES = {
  landscape: 'https://media.keepsdev.com/certificate-manager/default-images/landscape.png',
  portrait: 'https://media.keepsdev.com/certificate-manager/default-images/portrait.png',
};

@Component({
  selector: 'kp-certificate-preview',
  templateUrl: './certificate-create-preview.component.html',
  styles: `
    .background-image-container {
      background-size: 100%;
      background-repeat: no-repeat;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
})
export class CertificateCreatePreviewComponent {
  readonly certificate = input<CustomCertificateDto>();
  readonly backgroundImageSrc = input<string>();
  readonly logoImageSrc = input<string>();
  readonly creationScreen = input(false);

  get displayVisibleData(): boolean {
    const cert = this.certificate();
    return cert?.displayPerformance || cert?.displayTotalTime || cert?.displayConclusionDate;
  }

  getBackgroundImageSrc(): string {
    return this.backgroundImageSrc() || DEFAULT_IMAGES[this.certificate()?.orientation] || DEFAULT_IMAGES.landscape;
  }
}
