import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';

@Component({
  selector: 'app-collection-filter',
  templateUrl: './collection-filter.component.html',
  imports: [KpGlobalSearchInputComponent, MatSlideToggle, TranslocoPipe],
})
export class CollectionFilterComponent {
  @Input() searchTerm;
  @Input() inputIconClass: string;
  @Input() groupUserFilter: boolean;
  @Output() filterEvent = new EventEmitter<string>();
  @Output() deletedGroupUsersFilter = new EventEmitter<boolean>();

  onFilter(term: string): void {
    this.filterEvent.emit(term);
  }

  toggleChange(event: MatSlideToggleChange): void {
    this.deletedGroupUsersFilter.emit(event.checked);
  }
}
