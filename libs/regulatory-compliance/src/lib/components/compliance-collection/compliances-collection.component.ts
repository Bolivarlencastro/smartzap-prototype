import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComplianceListItem } from '../../models';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KpInfiniteScrollContainerComponent } from '@keeps-platform-frontend-workspace/ui/kp-infinite-scroll-container';
import { KpEditableComponent } from '@keeps-platform-frontend-workspace/ui/kp-editable';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.SELECTED.PLURAL');
marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.SELECTED.SINGULAR');

export type ComplianceListItemToggleEvent = {
  selected: boolean;
  id: string;
};

@Component({
  selector: 'kp-compliance-collection',
  templateUrl: './compliances-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCheckbox,
    MatIconButton,
    MatIcon,
    KpInfiniteScrollContainerComponent,
    KpEditableComponent,
    MatProgressSpinner,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
})
export class CompliancesCollectionComponent {
  @Input({ required: true }) items: ComplianceListItem[];
  @Input({ required: true }) itemsTotal: number;
  @Input({ required: true }) selectedTotal: number;
  @Input() isLoading: boolean;
  @Output() batchDelete = new EventEmitter<void>();
  @Output() toggleSelectAll = new EventEmitter<boolean>();
  @Output() toggleItemSelection = new EventEmitter<ComplianceListItemToggleEvent>();
  @Output() editItem = new EventEmitter<ComplianceListItem>();
  @Output() deleteItem = new EventEmitter<string>();
  @Output() loadMoreItems = new EventEmitter<void>();

  get hasSelection(): boolean {
    return !!this.selectedTotal;
  }

  get indeterminateCheck(): boolean {
    return this.hasSelection && !this.isAllSelected;
  }

  get isAllSelected(): boolean {
    return this.selectedTotal > 0 && this.selectedTotal === this.itemsTotal;
  }

  get isEmpty(): boolean {
    return !this.isLoading && !this.items?.length;
  }

  toggleAllRows(event: MatCheckboxChange) {
    this.toggleSelectAll.emit(event.checked);
  }

  onItemSelectionChange(checked: boolean, item: ComplianceListItem) {
    this.toggleItemSelection.emit({ selected: checked, id: item.id });
  }

  onBatchDelete() {
    this.batchDelete.emit();
  }

  onDeleteItem(item: ComplianceListItem): void {
    this.deleteItem.emit(item.id);
  }

  saveItemChanges(value: string, item: ComplianceListItem): void {
    this.editItem.emit({ ...item, name: value });
  }

  onScroll() {
    this.loadMoreItems.emit();
  }
}
