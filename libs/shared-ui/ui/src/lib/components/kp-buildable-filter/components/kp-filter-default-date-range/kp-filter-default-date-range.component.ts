import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { KpFilterRangeBaseComponent } from '../kp-filter-range-base';

@Component({
  selector: 'kp-filter-date-range-container',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, TranslocoModule],
  templateUrl: './kp-filter-default-date-range.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpFilterDefaultDateRangeComponent extends KpFilterRangeBaseComponent {}
