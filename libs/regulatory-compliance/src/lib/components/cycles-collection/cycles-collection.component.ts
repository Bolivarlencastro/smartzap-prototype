import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { CycleDurationTypePipe } from '../../pipes/cycle-duration-type.pipe';

marker('REGULATORY_COMPLIANCE.SELECTED_ITEM_MESSAGE.PLURAL');
marker('REGULATORY_COMPLIANCE.SELECTED_ITEM_MESSAGE.SINGULAR');

@Component({
  selector: 'kp-cycles-collection',
  templateUrl: './cycles-collection.component.html',
  styleUrls: ['./cycles-collection.component.scss'],
  imports: [
    MatTableModule,
    MatCheckbox,
    MatIconButton,
    MatIcon,
    NgxSkeletonLoaderModule,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
    CycleDurationTypePipe,
  ],
})
export class CyclesCollectionComponent implements OnChanges {
  @Input() cycles: CycleDto[];
  @Input() isLoading: boolean;

  @Output() editCycle = new EventEmitter<CycleDto>();
  @Output() deleteCycle = new EventEmitter<string[]>();

  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  dataSource: MatTableDataSource<CycleDto>;
  displayedColumns: string[] = ['select', 'name', 'enrollments', 'expiration', 'menu'];
  selection = new SelectionModel<CycleDto>(true, []);

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['cycles']) {
      this.dataSource = new MatTableDataSource<CycleDto>(this.cycles);
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

  onEdit(cycle: CycleDto): void {
    this.editCycle.emit(cycle);
  }

  onDelete(cycleId?: string): void {
    this.deleteCycle.emit(cycleId ? [cycleId] : this.selection.selected.map((item) => item.id));
  }
}
