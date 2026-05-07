import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FilterGroupConfig } from '../../model/filter-group-config';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-filter-dialog-selector-template',
  templateUrl: './filter-dialog-selector-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class FilterDialogSelectorTemplateComponent {
  @Input() selector: FilterGroupConfig | null;
}
