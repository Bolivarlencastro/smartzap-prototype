import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { Step } from 'app/main/learning-trail/model/learning-trail';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-linked-learning-trails-dialog',
  templateUrl: './linked-learning-trails-dialog.component.html',
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
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslocoPipe,
  ],
})
export class LinkedLearningTrailsComponent {
  displayedLinkedColumns: string[] = ['name'];
  results!: Step[];
  dataSourceLearningTrails: MatTableDataSource<Step>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Step[],
    public dialogRef: MatDialogRef<LinkedLearningTrailsComponent>,
  ) {
    this.dataSourceLearningTrails = new MatTableDataSource(data);
  }

  onClickRow(row: Step) {
    this.dialogRef.close({ row, results: this.results });
  }
}
