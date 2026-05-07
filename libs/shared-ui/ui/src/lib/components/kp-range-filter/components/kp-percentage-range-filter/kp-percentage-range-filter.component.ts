import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
  KpNumericRangeComponent,
  KpNumericRangeInputEndDirective,
  KpNumericRangeInputStartDirective,
} from '../../../kp-numeric-range';
import { KpRangeFilterBaseComponent } from '../kp-range-filter-base';
import { KpPreventMenuClosedOnTabDirective } from '../../../../directives';

@Component({
  selector: 'kp-percentage-range-filter',
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    TranslocoModule,
    KpNumericRangeComponent,
    KpNumericRangeInputStartDirective,
    KpNumericRangeInputEndDirective,
    NgxMaskDirective,
    KpPreventMenuClosedOnTabDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './kp-percentage-range-filter.component.html',
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
export class KpPercentageRangeFilterComponent extends KpRangeFilterBaseComponent {}
