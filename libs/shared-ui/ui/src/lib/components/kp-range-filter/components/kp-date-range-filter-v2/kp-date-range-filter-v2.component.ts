import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { format } from 'date-fns';
import { KpPreventMenuClosedOnTabDirective } from '../../../../directives';
import { KpRangeFilterBaseComponent } from '../kp-range-filter-base';

@Component({
  selector: 'kp-date-range-filter-v2',
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    TranslocoModule,
    KpPreventMenuClosedOnTabDirective,
  ],
  templateUrl: './kp-date-range-filter-v2.component.html',
  styles: [
    `
      :host {
        display: inline-flex;
        position: relative;
      }

      .item {
        border-color: var(--mat-sys-surface-container-highest) !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpDateRangeFilterV2Component extends KpRangeFilterBaseComponent implements OnChanges {
  @Input() maxDate: Date;

  initialLabelValue: string;

  override ngOnChanges(changes: SimpleChanges): void {
    if (changes['label']) {
      this.initialLabelValue = this.label;
      super.initialize();
    }
  }

  protected override buildButton(): void {
    super.buildButton();
    this.label = this.hasAppliedValue() ? this.formatButtonTitle() : this.initialLabelValue;
  }

  private formatButtonTitle(): string {
    const [gte, lte] = [this.gteFC.value, this.lteFC.value];
    return `${gte ? format(gte, 'dd/MM/yyyy') : '...'} - ${lte ? format(lte, 'dd/MM/yyyy') : '...'}`;
  }
}
