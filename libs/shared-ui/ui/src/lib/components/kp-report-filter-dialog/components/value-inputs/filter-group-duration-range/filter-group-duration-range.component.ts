import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KpPercentRangeInputComponent } from '../../../../kp-percent-range-input/kp-percent-range-input.component';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'kp-filter-group-duration-range',
  templateUrl: './filter-group-duration-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [MatFormField, KpPercentRangeInputComponent, FormsModule, ReactiveFormsModule],
})
export class FilterGroupDurationRangeComponent {
  convertToMinutes(time: string): string {
    const durationTime = time.split(':');
    return ((parseInt(durationTime[0]) || 0) * 60 * 60 + (parseInt(durationTime[1]) || 0) * 60).toString();
  }
}
