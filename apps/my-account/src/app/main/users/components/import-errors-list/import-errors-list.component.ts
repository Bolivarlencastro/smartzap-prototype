import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UserImportErrorItemDto } from 'app/main/users/user-import-types';
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
} from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-import-errors-list',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    TranslocoPipe,
    MatHeaderCellDef,
  ],
  templateUrl: './import-errors-list.component.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportErrorsListComponent {
  errors = input<UserImportErrorItemDto[]>();
  displayedColumns = ['line_number', 'message'];
}
