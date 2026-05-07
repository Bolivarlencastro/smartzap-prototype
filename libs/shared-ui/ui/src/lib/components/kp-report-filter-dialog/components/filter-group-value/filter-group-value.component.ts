import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { FilterGroupConfig } from '../../model/filter-group-config';
import { FilterGroupType } from '../../model/filter-group-type';
import { FilterFormGroup } from '../../model/forms-models';
import { FilterGroupTextFieldComponent } from '../value-inputs/filter-group-text-field/filter-group-text-field.component';
import { FilterGroupPercentRangeComponent } from '../value-inputs/filter-group-percent-range/filter-group-percent-range.component';
import { FilterGroupDurationRangeComponent } from '../value-inputs/filter-group-duration-range/filter-group-duration-range.component';
import { FilterGroupAutoCompleteSelectComponent } from '../value-inputs/filter-group-autocomplete-select/filter-group-autocomplete-select.component';
import { FilterGroupDateInputComponent } from '../value-inputs/filter-group-date-input/filter-group-date-input.component';
import { FilterGroupDateRangeComponent } from '../value-inputs/filter-group-date-range/filter-group-date-range.component';
import { FilterGroupSelectComponent } from '../value-inputs/filter-group-select/filter-group-select.component';

@Component({
  selector: 'kp-filter-group-value',
  templateUrl: './filter-group-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [
    FilterGroupSelectComponent,
    FilterGroupDateRangeComponent,
    FilterGroupDateInputComponent,
    FilterGroupAutoCompleteSelectComponent,
    FilterGroupDurationRangeComponent,
    FilterGroupPercentRangeComponent,
    FilterGroupTextFieldComponent,
  ],
})
export class FilterGroupValueComponent {
  @Input() currentSelector: FilterGroupConfig | null;
  @Input() filterFormGroup: FormGroup<FilterFormGroup>;
  FilterGroupType: typeof FilterGroupType = FilterGroupType;
}
