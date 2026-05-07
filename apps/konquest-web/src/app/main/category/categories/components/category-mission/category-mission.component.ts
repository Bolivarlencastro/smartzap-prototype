import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogTitle, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';

import { MatTable, MatColumnDef, MatCellDef, MatCell, MatRowDef, MatHeaderRow } from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';

export type CategoryMissionItem = {
  id: string;
  name: string;
};

@Component({
  selector: 'app-group-mission-create',
  templateUrl: './category-mission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatTooltip,
    MatIcon,
    CdkScrollable,
    MatDialogContent,
    MatTable,
    MatColumnDef,
    MatCellDef,
    MatCell,
    MatRowDef,
    MatHeaderRow,
    TranslocoPipe,
  ],
})
export class CategoryMissionComponent {
  dialogTitle!: string;
  items!: CategoryMissionItem[];
}
