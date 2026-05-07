import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { JobModel } from '../../models';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';
import { MatDivider } from '@angular/material/divider';

import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  imports: [
    KpGlobalSearchInputComponent,
    MatDivider,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCheckbox,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatIcon,
    MatButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatNoDataRow,
    MatProgressSpinner,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
})
export class JobListComponent implements OnChanges {
  @Input() searchTerm: string;
  @Input() items: JobModel[];
  @Input() selectAddJobButtonLabel: string;
  @Input() selectEmptyListMessage: string;
  @Input() loading: boolean;
  @Output() filterEvent = new EventEmitter<string>();
  @Output() openDialog = new EventEmitter<JobModel | void>();
  @Output() deleteItem = new EventEmitter<string | string[]>();
  @Output() scrolled = new EventEmitter<void>();

  dataSource: MatTableDataSource<JobModel>;
  displayedColumns: string[] = ['select', 'name', 'menu'];
  selection = new SelectionModel<JobModel>(true, []);

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['items']) {
      this.dataSource = new MatTableDataSource<JobModel>(this.items);
      this.selection.clear();
    }
  }

  // Whether the number of selected elements matches the total number of rows.
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Selects all rows if they are not all selected; otherwise clear selection.
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  onOpenDialog(item?: JobModel): void {
    this.openDialog.emit(item);
  }

  onDelete(itemId?: string): void {
    const id = itemId || this.selection.selected.map((item) => item.id);
    this.deleteItem.emit(id);
  }
}
