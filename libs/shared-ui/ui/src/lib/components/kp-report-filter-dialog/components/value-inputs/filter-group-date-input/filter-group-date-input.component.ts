import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatSuffix } from '@angular/material/form-field';

@Component({
  selector: 'kp-filter-group-date-input',
  templateUrl: './filter-group-date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    TranslocoPipe,
  ],
})
export class FilterGroupDateInputComponent {}
