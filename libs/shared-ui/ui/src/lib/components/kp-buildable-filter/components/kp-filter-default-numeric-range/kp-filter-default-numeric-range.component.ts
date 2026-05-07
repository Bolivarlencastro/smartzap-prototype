import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { KpFilterDefaultDateRangeComponent } from '../kp-filter-default-date-range/kp-filter-default-date-range.component';
import {
  KpNumericRangeComponent,
  KpNumericRangeInputEndDirective,
  KpNumericRangeInputStartDirective,
} from '../../../kp-numeric-range';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'kp-filter-default-numeric-range',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    TranslocoModule,
    KpNumericRangeComponent,
    KpNumericRangeInputEndDirective,
    KpNumericRangeInputStartDirective,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './kp-filter-default-numeric-range.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpFilterDefaultNumericRangeComponent extends KpFilterDefaultDateRangeComponent {
  @Input({ required: true }) mask: string;
  @Input() startPlaceHolder: string;
  @Input() endPlaceHolder: string;
  @Input() dropSpecialCharacters = true;
  @Input() suffix: string;
  @Input() maxLength: number;

  get templateMaxLength() {
    return this.maxLength || this.mask?.length;
  }
}
