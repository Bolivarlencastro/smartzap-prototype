import { Component, Input } from '@angular/core';
import { KpFilterOption } from '../../models';

@Component({
  template: '',
  standalone: true,
})
export class KpFilterRangeBaseComponent {
  @Input() selectedOption: KpFilterOption;

  get isRange(): boolean {
    return this.selectedOption?.rangeType === 'between';
  }

  get singleControlName(): string {
    switch (this.selectedOption?.rangeType) {
      case 'less':
        return this.selectedOption?.rangeConfig.toKey;
      case 'more':
        return this.selectedOption?.rangeConfig.fromKey;
      default:
        return this.selectedOption?.filterKey;
    }
  }
}
