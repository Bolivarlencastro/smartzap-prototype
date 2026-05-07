import { DecimalPipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
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
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Pulse } from '../../models/pulse';
import { DataExporterService } from '../../services/data-exporter.service';

@Component({
  selector: 'lp-pulses-list',
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
    MatSort,
    MatSortHeader,
    MatIcon,
    KpDurationPipe,
    PercentPipe,
    DecimalPipe,
    TitleCasePipe,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './pulses-list.component.html',
  providers: [KpDurationPipe, PercentPipe, DecimalPipe, DataExporterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulsesListComponent {
  protected readonly displayedColumns = ['name', 'type', 'duration', 'views', 'consumption_rate'];

  readonly isLoading = input<boolean>();
  readonly pulses = input<Pulse[]>();
  readonly hideTable = computed(() => this.isLoading() || !this.pulses()?.length);
  readonly showEmptyState = computed(() => !this.isLoading() && !this.pulses()?.length);
  readonly sort = output<Sort>();
  readonly rowClick = output<Pulse>();
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(private readonly dataExporter: DataExporterService) {}

  onSort(sort: Sort) {
    this.sort.emit(sort);
  }

  onRowClick(pulse: Pulse) {
    this.rowClick.emit(pulse);
  }

  exportTable() {
    this.dataExporter.exportToCSV<Pulse>('pulses.csv', this.pulses(), {
      name: { title: 'LEADER_PANEL.PULSES.LIST.NAME' },
      type: { title: 'LEADER_PANEL.PULSES.LIST.TYPE' },
      duration: { title: 'LEADER_PANEL.PULSES.LIST.DURATION', pipe: KpDurationPipe },
      views: { title: 'LEADER_PANEL.PULSES.LIST.VIEWS', pipe: DecimalPipe },
      consumption_rate: { title: 'LEADER_PANEL.PULSES.LIST.CONSUMPTION_RATE', pipe: PercentPipe },
    });
  }
}
