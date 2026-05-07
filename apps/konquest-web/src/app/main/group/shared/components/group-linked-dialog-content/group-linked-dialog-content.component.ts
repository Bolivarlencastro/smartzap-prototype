import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  KpVinculateListComponent,
  VinculateListColumnDefinition,
  VinculateListItemSelectionChange,
} from '@keeps-platform-frontend-workspace/ui/kp-vinculate-list';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-group-linked-dialog-content',
  templateUrl: './group-linked-dialog-content.component.html',
  styleUrls: ['./group-linked-dialog-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KpGlobalSearchInputComponent, MatDivider, KpVinculateListComponent],
})
export class GroupLinkedDialogContentComponent<T extends { id: string }> {
  @Input() items: T[];
  @Input() isLoading!: boolean;
  @Input() selectedItems: { [s: string]: string } = {};
  @Input() total!: number;
  @Input() page!: number;
  @Input() selectionLabel: string;
  @Input({ required: true }) columns: VinculateListColumnDefinition<T>[] = [];
  @Input() avatarKey: string;

  @Output() selectionEvent = new EventEmitter<T>();
  @Output() selectAllEvent = new EventEmitter<string[]>();
  @Output() scrollEvent = new EventEmitter<number>();
  @Output() filterEvent = new EventEmitter<string>();

  onScroll(): void {
    if (this.items.length < this.total && !this.isLoading) {
      this.scrollEvent.emit(this.page);
    }
  }

  itemSelectionChange(event: VinculateListItemSelectionChange<T>) {
    this.selectionEvent.emit(event.item);
  }

  onSelectAll(selected: boolean) {
    this.selectAllEvent.emit(selected ? this.getAllIds() : []);
  }

  private getAllIds(): string[] {
    if (!this.items) {
      return [];
    }
    return this.items?.map((item) => item.id);
  }
}
