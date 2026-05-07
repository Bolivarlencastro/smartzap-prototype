import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kp-info-tag',
  imports: [MatIconModule],
  templateUrl: './kp-info-tag.component.html',
  styles: [
    `
      :host {
        font-size: 10px;
        line-height: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpInfoTagComponent {
  @Input() icon: string;
  @Input() svgIcon: string;
  @Input() label: string;
}
