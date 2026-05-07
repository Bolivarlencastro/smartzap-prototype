import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UserImportItemDto } from 'app/main/users/user-import-types';
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
} from '@angular/material/table';
import { DatePipe, DecimalPipe, PercentPipe, UpperCasePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserImportStatusPipe } from 'app/main/users/pipes/user-import-status.pipe';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { UserImportStatusColorPipe } from 'app/main/users/pipes/user-import-status-color.pipe';

@Component({
  selector: 'app-user-imports-list',
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
    DatePipe,
    DecimalPipe,
    PercentPipe,
    UserImportStatusPipe,
    MatIconButton,
    MatIcon,
    MatTooltip,
    RouterLink,
    KpCardTagComponent,
    UpperCasePipe,
    UserImportStatusColorPipe,
    MatNoDataRow,
  ],
  templateUrl: './user-imports-component-list.component.html',
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
export class UserImportsComponentList {
  imports = input<UserImportItemDto[]>();
  displayedColumns = ['date', 'time', 'status', 'total_to_import', 'success_count', 'error_count', 'progress', 'menu'];
}
