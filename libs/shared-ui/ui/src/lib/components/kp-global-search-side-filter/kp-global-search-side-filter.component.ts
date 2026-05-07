import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { KpGlobalSearchFilterFormComponent } from '../kp-global-search-filter-form';
import { GlobalSearchFilter, GlobalSearchFilterOptions } from './model';

@Component({
  selector: 'kp-global-search-side-filter',
  imports: [TranslocoModule, KpGlobalSearchFilterFormComponent],
  templateUrl: './kp-global-search-side-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpGlobalSearchSideFilterComponent {
  @Input() activeFilters: GlobalSearchFilter;
  @Input() filterOptions: GlobalSearchFilterOptions;
  @Output() filterEvent = new EventEmitter<GlobalSearchFilter>();
  @Output() cleanFilterEvent = new EventEmitter<void>();

  filter(filter: GlobalSearchFilter): void {
    this.filterEvent.emit(filter);
  }

  cleanFilter(): void {
    this.cleanFilterEvent.emit();
  }
}
