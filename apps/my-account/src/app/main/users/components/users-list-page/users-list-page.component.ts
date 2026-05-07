import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { UserSearchFilter } from '@app/shared/model';
import { UserFilterLists } from '../../users.types';
import { BatchActionsViewModel, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SelectionModel } from '@angular/cdk/collections';
import { KpBatchActionSelectionCounterComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-selection-counter';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { UsersTitleComponent } from '../users-title/users-title.component';
import { UsersSearchComponent } from '../users-search/users-search.component';
import { UsersListComponent } from '../users-list/users-list.component';

@Component({
  selector: 'app-users-list-page',
  template: `
    @if ((batchActionsVm()?.isTotalSelected || selection()?.hasValue()) && !isLoading()) {
      <kp-batch-action-selection-counter
        [isAllSelected]="batchActionsVm()?.isTotalSelected"
        [selection]="selection()?.selected.length"
        [total]="page()?.length"
        [hasAppliedFilter]="hasAppliedFilter()"
        allSelectedMessage="USERS.LIST.COUNTER.ALL_SELECTED.MESSAGE"
        simpleSelectionMessage="USERS.LIST.COUNTER.SIMPLE_SELECTION.MESSAGE"
        simpleSelectionLink="USERS.LIST.COUNTER.SIMPLE_SELECTION.LINK"
        (selectAll)="onToggleTotalSelection(users())"
        (clear)="onToggleTotalSelection()"
      ></kp-batch-action-selection-counter>
    }

    <div class="flex-none">
      <app-users-title [currentRoute]="currentRoute()" (dialogOpened)="onOpenDialog()"></app-users-title>
    </div>

    <kp-table-layout
      class="grow h-max shrink-0"
      [totalItems]="page()?.length"
      [pageSize]="page()?.pageSize"
      [pageIndex]="page()?.pageIndex"
      (pageChange)="onChangePage($event)"
      (searchChange)="onSearch($event)"
    >
      <app-users-search
        kpTableFilterAfter
        [filterLists]="filterLists()"
        (displayedColumnsChanged)="onSetDisplayedColumns($event)"
        (filterChanged)="onFilter($event)"
      ></app-users-search>
      <app-users-list
        kpTable
        [users]="users()"
        [displayedColumns]="displayedColumns()"
        [batchActionsVm]="batchActionsVm()"
        [isLoading]="isLoading()"
        [(selection)]="selection"
        (sortChanged)="onSort($event)"
        (statusChanged)="onStatusChange($event)"
        (clearTotalSelection)="emitChangedTotalSelection(false)"
      ></app-users-list>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        max-height: max-content;
        min-height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KpBatchActionSelectionCounterComponent,
    KpTableLayoutComponent,
    UsersTitleComponent,
    UsersSearchComponent,
    UsersListComponent,
  ],
})
export class UsersListPageComponent {
  batchActionsVm = input<BatchActionsViewModel>();
  hasAppliedFilter = input<boolean>();
  currentRoute = input<string>();
  filterLists = input<UserFilterLists>();
  users = input<UserProfile[]>();
  page = input<PageEvent>();
  displayedColumns = input<string[]>();
  isLoading = input<boolean>();
  selection = model<SelectionModel<UserProfile>>();

  openDialog = output<void>();
  searchChanged = output<string>();
  displayedColumnsChanged = output<string[]>();
  filterChanged = output<UserSearchFilter>();
  sortChanged = output<Sort>();
  pageChanged = output<PageEvent>();
  statusChanged = output<UserProfile>();
  toggleTotalSelection = output<boolean>();

  onOpenDialog() {
    this.openDialog.emit();
  }

  onSearch(search: string) {
    this.searchChanged.emit(search);
  }

  onSetDisplayedColumns(columns: string[]) {
    this.displayedColumnsChanged.emit(columns);
  }

  onFilter(data: UserSearchFilter) {
    this.filterChanged.emit(data);
  }

  onSort(sort: Sort) {
    this.sortChanged.emit(sort);
  }

  onChangePage(pageEvent: PageEvent) {
    this.pageChanged.emit(pageEvent);
  }

  onStatusChange(user: UserProfile) {
    this.statusChanged.emit(user);
  }

  onToggleTotalSelection(items?: UserProfile[]): void {
    if (items) {
      this.selection().select(...items);
    } else {
      this.selection().clear();
    }

    this.emitChangedTotalSelection(!!items);
  }

  emitChangedTotalSelection(isTotalSelected: boolean): void {
    this.toggleTotalSelection.emit(isTotalSelected);
  }
}
