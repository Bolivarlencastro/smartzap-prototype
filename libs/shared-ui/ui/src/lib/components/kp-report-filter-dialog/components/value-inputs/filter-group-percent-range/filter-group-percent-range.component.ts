import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KpPercentRangeInputComponent } from '../../../../kp-percent-range-input/kp-percent-range-input.component';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'kp-filter-group-percent-range',
  templateUrl: './filter-group-percent-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [MatFormField, KpPercentRangeInputComponent, FormsModule, ReactiveFormsModule],
})
export class FilterGroupPercentRangeComponent {
  normalizeFn(value: string): string {
    return (+value / 100).toFixed(2);
  }

  reverseNormalizeFn(value: string): string {
    return (+value * 100).toFixed(0);
  }
}
