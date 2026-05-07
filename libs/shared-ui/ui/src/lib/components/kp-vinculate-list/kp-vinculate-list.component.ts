import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VinculateListColumnDefinition, VinculateListItemSelectionChange } from './models';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { TranslocoModule } from '@jsverse/transloco';
import { KpInfiniteScrollContainerComponent } from '../kp-infinite-scroll-container';
import { constants } from '../../constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'kp-vinculate-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    TranslocoModule,
    KpInfiniteScrollContainerComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './kp-vinculate-list.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .full-height-container {
        height: calc(100% - 56px);
      }

      .vinculate-list-table {
        background-color: var(--mat-dialog-container-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpVinculateListComponent<T extends { id: string }> implements OnChanges {
  @Input({ required: true }) columns: VinculateListColumnDefinition<T>[];
  @Input({ required: true }) items: T[];
  @Input({ required: true }) scrollContainerHeight: string;
  @Input() emptyPlaceholder: string;
  @Input() loading: boolean;
  @Input() avatarKey: string;
  @Input() selectable = false;
  @Input() selection: Record<string, string>;
  @Input() selectionLabel: string;
  @Output() selectAllChange = new EventEmitter<boolean>();
  @Output() itemSelectionChange = new EventEmitter<VinculateListItemSelectionChange<T>>();
  @Output() scrolled = new EventEmitter<void>();

  protected readonly defaultAvatar = constants.defaultUserAvatar;
  displayedColumns: string[];

  isSelected(item: T): boolean {
    return !!this.selection[item.id];
  }

  get selectedTotal(): number {
    if (!this.selection) {
      return 0;
    }
    return Object.keys(this.selection).length;
  }

  get hasSelection(): boolean {
    return !!this.selectedTotal;
  }

  get isAllSelected(): boolean {
    return this.selectedTotal > 0 && this.selectedTotal === this.items?.length;
  }

  get indeterminateCheck(): boolean {
    return this.hasSelection && !this.isAllSelected;
  }

  get hasItems(): boolean {
    return !!this.items?.length;
  }

  get isEmpty(): boolean {
    return !this.loading && !this.hasItems;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectable'] || changes['avatarKey'] || changes['columns']) {
      this.buildDisplayedColumns();
    }
  }

  toggleAllRows(event: MatCheckboxChange) {
    this.selectAllChange.emit(event.checked);
  }

  onItemSelectionChange(event: MatCheckboxChange, item: T) {
    this.itemSelectionChange.emit({ selected: event.checked, item });
  }

  accessProperty<T, K extends keyof T>(item: T, property: K): T[K] {
    return item[property];
  }

  onScroll() {
    this.scrolled.emit();
  }

  trackByFunction(_index: number, item: T): string {
    return item.id;
  }

  private buildDisplayedColumns() {
    const columns: string[] = [];

    if (this.selectable) {
      columns.push('select');
    }

    if (this.avatarKey) {
      columns.push('avatar');
    }

    const mappedColumns = this.mapColumns();
    this.displayedColumns = [...columns, ...(mappedColumns || [])];
  }

  private mapColumns(): string[] | undefined {
    if (this.columns) {
      return this.columns.map((column) => column.property);
    }
    return undefined;
  }
}
