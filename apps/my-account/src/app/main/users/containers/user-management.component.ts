import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { Sort } from '@angular/material/sort';
import { UserSearchFilter } from '@app/shared/model';
import { Store } from '@ngrx/store';
import { Observable, Subject, tap } from 'rxjs';
import { UserDetailsDrawerService } from '../services/user-details-drawer.service';
import { BatchActionsActions, UsersImportDialogActions, UsersListActions } from '../store/actions';
import { UsersListSelectors } from '../store/selectors';
import { UserFilterLists } from '../users.types';
import { batchActionsFeature, usersListFilterFeature } from '../store/features';
import { BatchAction, BatchActionsViewModel, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SelectionModel } from '@angular/cdk/collections';
import { KpBatchActionSelectionComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-selection';
import { RouterOutlet } from '@angular/router';
import { UsersListPageComponent } from '../components/users-list-page/users-list-page.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-management',
  template: `
    @let batchActionsVm = batchActionsVm$ | async;
    @let page = page$ | async;
    @let isLoading = isLoading$ | async;
    @if ((batchActionsVm?.isTotalSelected || selection?.hasValue()) && !isLoading) {
      <kp-batch-action-selection
        [actions]="batchActionsVm?.actions"
        (dispatch)="dispatchAction($event, page?.length)"
        (clear)="clearSelection()"
      ></kp-batch-action-selection>
    }
    <mat-drawer-container [hasBackdrop]="true" class="h-full overflow-y-auto">
      <mat-drawer position="end" [mode]="'over'" #matDrawer class="w-full md:w-160 dark:bg-zinc-800">
        <router-outlet></router-outlet>
      </mat-drawer>

      <mat-drawer-content class="bg-default flex flex-col">
        <app-users-list-page
          [batchActionsVm]="batchActionsVm"
          [hasAppliedFilter]="hasAppliedFilter$ | async"
          [currentRoute]="currentRoute$ | async"
          [filterLists]="filterLists$ | async"
          [users]="users$ | async"
          [page]="page"
          [displayedColumns]="displayedColumns$ | async"
          [isLoading]="isLoading"
          [selection]="selection"
          (openDialog)="onOpenDialog()"
          (searchChanged)="onSearch($event)"
          (displayedColumnsChanged)="onSetDisplayedColumns($event)"
          (filterChanged)="onFilter($event)"
          (sortChanged)="onSort($event)"
          (pageChanged)="onChangePage($event)"
          (statusChanged)="onStatusChange($event)"
          (toggleTotalSelection)="onToggleTotalSelection($event)"
        ></app-users-list-page>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 64px);
        overflow-y: auto;
      }
    `,
  ],
  imports: [
    KpBatchActionSelectionComponent,
    MatDrawerContainer,
    MatDrawer,
    RouterOutlet,
    MatDrawerContent,
    UsersListPageComponent,
    AsyncPipe,
  ],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  selection = new SelectionModel<UserProfile>(true, []);

  private _unsusbscribeAll: Subject<null> = new Subject<null>();

  users$: Observable<UserProfile[]>;
  page$: Observable<PageEvent>;
  isLoading$: Observable<boolean>;
  isLoading: boolean;
  currentRoute$: Observable<string>;
  displayedColumns$: Observable<string[]>;
  filterLists$: Observable<UserFilterLists>;
  batchActionsVm$: Observable<BatchActionsViewModel>;
  hasAppliedFilter$: Observable<boolean>;

  constructor(
    private store: Store,
    private _matDrawerService: UserDetailsDrawerService,
  ) {
    this.users$ = this.store.select(UsersListSelectors.selectUsers).pipe(tap(() => this.clearSelection()));
    this.isLoading$ = this.store.select(UsersListSelectors.selectIsLoading);
    this.page$ = this.store.select(UsersListSelectors.selectPage);
    this.displayedColumns$ = this.store.select(UsersListSelectors.selectDisplayedColumns);
    this.filterLists$ = this.store.select(usersListFilterFeature.selectFilterLists);
    this.batchActionsVm$ = store.select(batchActionsFeature.selectViewModel);
    this.hasAppliedFilter$ = store.select(UsersListSelectors.selectHasAppliedFilter);

    this.store.dispatch(UsersListActions.init());
  }

  ngOnInit() {
    this._matDrawerService.setDrawer(this.matDrawer);
  }

  ngOnDestroy() {
    this._unsusbscribeAll.complete();
    this.store.dispatch(UsersListActions.clear());
  }

  onSearch(search: string) {
    this.store.dispatch(UsersListActions.search({ search }));
  }

  onChangePage(pageEvent: PageEvent) {
    this.store.dispatch(UsersListActions.changePage({ pageEvent }));
  }

  onSort(sort: Sort) {
    this.store.dispatch(UsersListActions.sort({ sort }));
  }

  onStatusChange(user: UserProfile) {
    this.store.dispatch(UsersListActions.toggleUserStatus({ user }));
  }

  onOpenDialog() {
    this.store.dispatch(UsersImportDialogActions.openDialog());
  }

  onSetDisplayedColumns(columns: string[]) {
    this.store.dispatch(UsersListActions.setDisplayedColumns({ columns }));
  }

  onFilter(data: UserSearchFilter) {
    this.store.dispatch(UsersListActions.filter({ data }));
  }

  onToggleTotalSelection(isTotalSelected: boolean): void {
    this.store.dispatch(BatchActionsActions.toggleTotalSelection({ isTotalSelected }));
  }

  clearSelection(): void {
    this.onToggleTotalSelection(false);
    this.selection = new SelectionModel<UserProfile>(true, []);
  }

  dispatchAction(action: BatchAction, total: number): void {
    const ids = this.selection.selected.map((item) => item.id);
    this.store.dispatch(BatchActionsActions.dispatchAction({ action, ids, total }));
  }
}
