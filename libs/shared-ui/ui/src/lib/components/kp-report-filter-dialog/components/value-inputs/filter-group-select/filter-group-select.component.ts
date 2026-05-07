import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterGroupConfig } from '../../../model/filter-group-config';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'kp-filter-group-select',
  templateUrl: './filter-group-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [MatFormField, MatSelect, FormsModule, ReactiveFormsModule, MatOption, TranslocoPipe],
})
export class FilterGroupSelectComponent {
  @Input() currentSelector: FilterGroupConfig;
}
