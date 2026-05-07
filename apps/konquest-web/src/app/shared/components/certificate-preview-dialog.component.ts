import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KpSafeUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-safe-url';

@Component({
  selector: 'app-certificate-preview-dialog',
  imports: [KpSafeUrlPipe],
  template: ` <iframe class="certificate-iframe" [src]="url | kpSafeUrl"></iframe> `,
  styles: `
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatePreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected url: string) {}
}
