import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { KpDocsUrlPipe } from '../../../pipes/kp-docs-url/kp-docs-url.pipe';
import { KpSafeUrlPipe } from '../../../pipes/kp-safe-url/kp-safe-url.pipe';

@Component({
  selector: 'kp-docs-viewer',
  template: `
    @if (url) {
      <iframe [src]="url | kpDocsUrl | kpSafeUrl" class="frame-view" allow="fullscreen"></iframe>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  imports: [KpSafeUrlPipe, KpDocsUrlPipe],
})
export class KpDocsViewerComponent {
  @Input() url: string;
}
