import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-certificate-history',
  template: `
    <div class="mt-6 text-xs max-h-32 overflow-y-scroll">
      @if (history) {
        <pre class="whitespace-pre-line">{{ history }}</pre>
      }
      @if (!history) {
        <div>
          {{ 'CERTIFICATE.HISTORIC_EMPTY_MESSAGE' | transloco }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
})
export class CertificateHistoryComponent {
  @Input({ required: true }) history: string | undefined;
}
