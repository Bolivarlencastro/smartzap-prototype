import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Page, ReportType } from 'app/shared/model';
import { UsersFilter } from '../../model';
import { ReportActions } from 'app/shared/store/actions';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UsersActions } from '../../store/actions';
import { UsersSelector } from '../../store/selectors';
import { UserSummary } from '../../store/selectors/users.selectors';
import { CourseCreateEnrollmentDialogComponent } from 'app/main/courses/modules/enrollments/components';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { PageEvent } from '@angular/material/paginator';
import { FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UserFilterComponent } from '../../components/user-filter/user-filter.component';
import { UserSideMenuComponent } from '../../components/user-side-menu/user-side-menu.component';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpTableLayoutComponent } from 'libs/shared-ui/ui/src/lib/components/kp-table-layout';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    UserSideMenuComponent,
    FuseScrollbarModule,
    MatIcon,
    MatButton,
    MatIconButton,
    UserListComponent,
    UserFilterComponent,
    AsyncPipe,
    TranslocoPipe,
    KpTableLayoutComponent,
  ],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  users$!: Observable<any>;
  isLoading$!: Observable<boolean>;
  searchTerm$!: Observable<string>;
  subscriptions$: Subscription;
  page$!: Observable<Page>;
  selectedUsersCount$!: Observable<number>;
  summary: Signal<UserSummary>;
  filters: Signal<UsersFilter>;
  availableTags: Signal<string[]>;

  constructor(
    private store: Store,
    private _dialog: MatDialog,
  ) {
    this.store.dispatch(UsersActions.init());
    this.subscriptions$ = new Subscription();
    this.page$ = this.store.select(UsersSelector.selectPage);
    this.users$ = this.store.select(UsersSelector.selectGetUsers);
    this.selectedUsersCount$ = this.store.select(UsersSelector.selectSelectedUsersCount);
    this.summary = toSignal(this.store.select(UsersSelector.selectUserSummary));
    this.filters = toSignal(this.store.select(UsersSelector.selectFilters), { initialValue: { tags: [], synced: [] } });
    this.availableTags = toSignal(this.store.select(UsersSelector.selectAvailableTags), { initialValue: [] });
  }

  ngOnInit(): void {
    this.searchTerm$ = this.store.select(UsersSelector.selectGetSearchTerm);
  }

  ngAfterViewInit(): void {
    this.isLoading$ = this.store.select(UsersSelector.selectIsLoading);
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  onRemove(id: string): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);
    dialogRef.componentInstance.confirmMessage = 'USERS.DIALOG_REMOVE_MESSAGE';

    dialogRef
      .afterClosed()
      .pipe(filter((value) => value === true))
      .subscribe(() => this.store.dispatch(UsersActions.removeUser({ id })));
  }

  onEdit(user: any): void {
    const userObject = { ...user, type: 'edit' };
    const dialogRef = this._dialog.open(CourseCreateEnrollmentDialogComponent, {
      data: userObject,
      width: '100%',
      maxWidth: '550px',
    });
    dialogRef.componentInstance.title = 'USERS.TABLE.NAME';

    this.subscriptions$.add(
      dialogRef
        .afterClosed()
        .pipe(
          filter((result) => result),
          tap(({ data }) => {
            const phoneNumeric = data.phone.replace(/\D/g, '');
            const payload = {
              phone: phoneNumeric,
              name: data.name,
              email: data.email,
              tags: data.tags,
            };
            this.store.dispatch(UsersActions.updateUser({ id: user.id, user: payload }));
          }),
        )
        .subscribe(),
    );
  }

  onGenerateReport(reportType: ReportType): void {
    this.store.dispatch(ReportActions.generateReport({ reportType }));
  }

  onUserSelected(user: { id: string; selected: boolean }): void {
    this.store.dispatch(UsersActions.toggleSelectUser(user));
  }

  onDeleteSelected(userIds: string[]): void {
    if (!userIds.length) {
      return;
    }
    const confirmDialogRef = this._dialog.open(KpConfirmDialogComponent);
    confirmDialogRef.componentInstance.confirmMessage = 'USERS.DIALOG_REMOVE_SELECTED_MESSAGE';

    this.subscriptions$.add(
      confirmDialogRef
        .afterClosed()
        .pipe(filter((response) => response))
        .subscribe(() => {
          userIds.forEach((userId) => this.store.dispatch(UsersActions.removeUser({ id: userId })));
        }),
    );
  }

  onSearch(searchTerm: string): void {
    this.store.dispatch(UsersActions.searchUsers({ searchTerm }));
  }

  onFilter(filters: UsersFilter): void {
    this.store.dispatch(UsersActions.filterUsers({ filters }));
  }

  onSort(sort: string): void {
    this.store.dispatch(UsersActions.sortUsers({ sort }));
  }

  onSelectAll(): void {
    this.store.dispatch(UsersActions.toggleSelectAll());
  }

  onAddUser(): void {
    const dialogRef = this._dialog.open(CourseCreateEnrollmentDialogComponent, {
      width: '100%',
      maxWidth: '550px',
    });
    dialogRef.componentInstance.title = 'USERS.TABLE.NAME';

    this.subscriptions$.add(
      dialogRef
        .afterClosed()
        .pipe(
          filter((result) => result),
          tap(({ data }) => {
            const phoneNumeric = data.phone.replace(/\D/g, '');
            const payload = { phone: phoneNumeric, name: data.name, email: data.email, tags: data.tags };
            this.store.dispatch(UsersActions.updateUser({ id: '', user: payload }));
          }),
        )
        .subscribe(),
    );
  }

  onFetchMoreUsers(): void {
    this.store.dispatch(UsersActions.fetchMoreUsers());
  }

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.store.dispatch(UsersActions.setUserPagination({ currentPage: pageIndex + 1, per_page: pageSize }));
  }
}
