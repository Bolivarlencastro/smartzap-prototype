import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Transfer } from '../../models/transfer.model';
import { TransfersActions, TransfersFiltersActions } from '../../store/actions';
import * as fromSelectors from '../../store/selectors/transfer.selectors';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TransferCollectionComponent } from '../../components/transfer-collection/transfer-collection.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transfer-list',
  template: `
    <div class="w-full h-32 border-b border-default flex items-center">
      <span class="text-2xl font-semibold ml-6">{{ 'NAVIGATION.TRANSFERS' | transloco }}</span>
    </div>
    <kp-table-layout
      class="grow"
      [totalItems]="count()"
      [pageIndex]="currentPage()"
      [pageSize]="perPage()"
      (pageChange)="onPageChange($event)"
      (searchChange)="onFilterByInput($event)"
    >
      <button kpTableFilterAfter mat-icon-button (click)="openFilters()">
        <mat-icon>filter_alt</mat-icon>
      </button>
      <app-transfer-collection
        kpTable
        [transfers]="transfers()"
        [isLoading]="isLoading()"
        (deleteTransfer)="onDelete($event)"
        (sort)="onSort($event)"
      ></app-transfer-collection>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon, TransferCollectionComponent, TranslocoPipe, KpTableLayoutComponent],
})
export class TransferListComponent implements OnInit, OnDestroy {
  protected readonly transfers: Signal<Transfer[]>;
  protected readonly isLoading: Signal<boolean>;
  protected readonly perPage: Signal<number>;
  protected readonly count: Signal<number>;
  protected readonly currentPage: Signal<number>;

  constructor(private store: Store) {
    this.transfers = toSignal(this.store.select(fromSelectors.selectTransfers));
    this.isLoading = toSignal(this.store.select(fromSelectors.selectIsLoading));
    this.perPage = toSignal(this.store.select(fromSelectors.selectPerPage));
    this.count = toSignal(this.store.select(fromSelectors.selectTotal));
    this.currentPage = toSignal(this.store.select(fromSelectors.selectCurrentPage));
  }

  ngOnInit(): void {
    this.store.dispatch(TransfersActions.loadTransfers());
  }

  onDelete(transfer: Transfer): void {
    this.store.dispatch(TransfersActions.deleteTransfer({ id: transfer.id }));
  }

  onSort({ active, direction }: Sort): void {
    this.store.dispatch(TransfersActions.setSort({ sort: { field: active, direction } }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.store.dispatch(TransfersActions.paginationChange({ page: pageIndex + 1, perPage: pageSize }));
  }

  openFilters(): void {
    this.store.dispatch(TransfersFiltersActions.openFilterDialog());
  }

  onFilterByInput(search: string): void {
    this.store.dispatch(TransfersActions.setSearch({ search }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(TransfersActions.resetState());
  }
}
