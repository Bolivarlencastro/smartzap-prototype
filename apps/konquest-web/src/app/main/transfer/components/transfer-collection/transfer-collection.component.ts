import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Sort, MatSort, MatSortHeader } from '@angular/material/sort';
import { TransferAction } from '../../models/transfer-action';
import { Transfer } from '../../models/transfer.model';
import { navigateToMission } from 'app/shared/services';
import { Router } from '@angular/router';
import { DecimalPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
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
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { TranslocoPipe } from '@jsverse/transloco';
import { TransferTypePipe } from '../../pipes/transfer-type/transfer-type.pipe';
import { TransferInfoPipe } from '../../pipes/transfer-info/transfer-info.pipe';

@Component({
  selector: 'app-transfer-collection',
  templateUrl: './transfer-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgxSkeletonLoaderModule,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIcon,
    MatSortHeader,
    MatTooltip,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DecimalPipe,
    TitleCasePipe,
    DatePipe,
    TranslocoPipe,
    TransferTypePipe,
    TransferInfoPipe,
  ],
})
export class TransferCollectionComponent {
  readonly transfers = input<Transfer[]>();
  readonly isLoading = input<boolean>();
  readonly deleteTransfer = output<Transfer>();
  readonly sort = output<Sort>();

  protected readonly hiddenTable = computed(() => this.isLoading() || !this.transfers()?.length);
  protected readonly emptyState = computed(() => !this.isLoading() && !this.transfers()?.length);
  protected readonly showSkeleton = computed(() => !this.transfers()?.length && !!this.isLoading());

  protected readonly displayedColumns = [
    'type',
    'mission__name',
    'action',
    'manager_user__name',
    'source__name',
    'receiver__name',
    'created_date',
    'users_enrolled',
    'actions',
  ];
  protected readonly TransferAction = TransferAction;
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  private readonly router = inject(Router);

  handleDelete(transfer: Transfer) {
    this.deleteTransfer.emit(transfer);
  }

  handleSort(sort: Sort) {
    this.sort.emit(sort);
  }

  navigateToCourse(id: string) {
    navigateToMission(this.router, id);
  }
}
