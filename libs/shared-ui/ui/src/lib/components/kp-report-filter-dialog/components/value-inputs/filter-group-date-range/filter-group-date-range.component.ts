import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  MatDateRangeInput,
  MatStartDate,
  MatEndDate,
  MatDatepickerToggle,
  MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatFormField, MatSuffix } from '@angular/material/form-field';

@Component({
  selector: 'kp-filter-group-date-range',
  templateUrl: './filter-group-date-range.component.html',
  styleUrls: ['./filter-group-date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [
    MatFormField,
    MatDateRangeInput,
    FormsModule,
    ReactiveFormsModule,
    MatStartDate,
    MatEndDate,
    MatDatepickerToggle,
    MatSuffix,
    MatDateRangePicker,
    TranslocoPipe,
  ],
})
export class FilterGroupDateRangeComponent {}
