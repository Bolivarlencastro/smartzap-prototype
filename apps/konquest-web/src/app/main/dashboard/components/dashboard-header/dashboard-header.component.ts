import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
  selector: 'kp-dashboard-header',
  imports: [MatButtonModule, RouterLink, TranslocoModule],
  templateUrl: './dashboard-header.component.html',
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 0;

        @media (min-width: 600px) {
          padding: 24px 0;
        }
      }
    `,
  ],
})
export class DashboardHeaderComponent {
  @Input({ required: true }) label: string;
  @Input() actionButtonLink: any[] | string | null | undefined;
  @Input() actionLabel = marker('GENERAL.SEE_ALL');

  get displayLink() {
    return !!this.actionButtonLink;
  }
}
