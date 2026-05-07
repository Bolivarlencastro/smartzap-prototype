import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { KpFilterOption } from '../../models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-filter-key-select',
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule, TranslocoModule],
  templateUrl: './kp-filter-key-select.component.html',
  styles: [
    `
      :host {
        @apply flex gap-2 items-center max-w-72;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpFilterKeySelectComponent {
  @Input() options: KpFilterOption[];
  @Input() value: string;
  @Input() first: boolean;
  @Output() optionChange = new EventEmitter<string>();

  onSelectionChange(filterKey: string): void {
    this.optionChange.emit(filterKey);
  }
}
