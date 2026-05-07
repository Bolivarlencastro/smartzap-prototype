import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { SimpleFilterListItem } from '../../interfaces';
import { MatDivider } from '@angular/material/divider';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

@Component({
  selector: 'app-report-modal-list',
  templateUrl: './report-modal-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDivider,
    KpGlobalSearchInputComponent,
    InfiniteScrollDirective,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCheckbox,
    MatCellDef,
    MatCell,
    MatProgressBar,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatProgressSpinner,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
})
export class ReportModalListComponent implements OnChanges {
  @Input() columnTitle: string;
  @Input() selectionLabel: string;
  @Input() items: SimpleFilterListItem[];
  @Input() isLoading: boolean;
  @Input() validFilter: boolean;

  @Output() searchChanged = new EventEmitter<string>();
  @Output() loadMoreItems = new EventEmitter();
  @Output() submitEvent = new EventEmitter();

  dataSource: MatTableDataSource<SimpleFilterListItem>;
  displayedColumns: string[] = ['select', 'label'];
  selection = new SelectionModel<SimpleFilterListItem>(true, []);

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['items']) {
      this.dataSource = new MatTableDataSource<SimpleFilterListItem>(this.items);
    }
  }

  onSearch(term: string) {
    this.searchChanged.emit(term);
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  get selectedCount() {
    return this.selection.selected.length;
  }
}
