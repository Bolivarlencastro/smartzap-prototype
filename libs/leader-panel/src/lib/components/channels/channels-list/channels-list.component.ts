import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
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
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Channel } from '../../../models/channel';
import { DataExporterService } from '../../../services/data-exporter.service';

@Component({
  selector: 'lp-channels-list',
  imports: [
    DecimalPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    PercentPipe,
    TranslocoPipe,
    MatHeaderCellDef,
    DatePipe,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './channels-list.component.html',
  providers: [DatePipe, PercentPipe, DataExporterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsListComponent {
  protected readonly displayedColumns = ['name', 'pulses', 'enrolled_count', 'last_activity', 'general_progress'];

  readonly isLoading = input<boolean>();
  readonly channels = input<Channel[]>();
  readonly sort = output<Sort>();
  readonly rowClick = output<Channel>();
  readonly hideTable = computed(() => this.isLoading() || !this.channels()?.length);
  readonly showEmptyState = computed(() => !this.isLoading() && !this.channels()?.length);
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(private readonly dataExporter: DataExporterService) {}

  exportTable() {
    this.dataExporter.exportToCSV<Channel>('channels.csv', this.channels(), {
      name: { title: 'LEADER_PANEL.CHANNELS.LIST.NAME' },
      pulses: { title: 'LEADER_PANEL.CHANNELS.LIST.PULSES' },
      enrolled_count: { title: 'LEADER_PANEL.CHANNELS.LIST.ENROLLED_COUNT' },
      last_activity: { title: 'LEADER_PANEL.CHANNELS.LIST.LAST_ACTIVITY', pipe: DatePipe },
      general_progress: { title: 'LEADER_PANEL.CHANNELS.LIST.GENERAL_PROGRESS', pipe: PercentPipe },
    });
  }

  onSort(sort: Sort) {
    this.sort.emit(sort);
  }

  onRowClick(channel: Channel) {
    this.rowClick.emit(channel);
  }
}
