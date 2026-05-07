import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { RemoveDialogComponent } from 'app/main/group/shared/components/remove-dialog/remove-dialog.component';
import { GroupSubmitData, RemoveDialogActionData } from 'app/main/group/shared/group-shared.model';
import { filter, tap } from 'rxjs/operators';
import { GroupUser } from '../../group-user.model';
import * as fromActions from '../../store/group-user.actions';
import * as fromSelectors from '../../store/group-user.selectors';
import { GroupUserCreateComponent } from '../group-user-create/group-user-create.component';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { GroupUserListComponent } from '../../components/group-user-list/group-user-list.component';
import { FloatButtonComponent } from '../../../../../shared/components/float-button/float-button.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-users-page',
  template: `
    <kp-table-layout
      class="grow"
      [totalItems]="total()"
      [pageIndex]="currentPage()"
      [pageSize]="perPage()"
      (pageChange)="onPageChange($event)"
      (searchChange)="applyFilter($event)"
    >
      <mat-slide-toggle kpTableFilterAfter (change)="filterByDeletedUsers($event.checked)">
        {{ 'GROUP_USER.FILTER' | transloco }}
      </mat-slide-toggle>
      <app-group-user-list
        kpTable
        [data]="groupUsers()"
        [isLoading]="isLoading()"
        (sortEvent)="onSort($event)"
        (removeEvent)="onRemove($event)"
      ></app-group-user-list>
    </kp-table-layout>
    <app-float-button [tooltip]="'GROUP_USER.BUTTON.CREATE' | transloco" (clickEvent)="openDialog()"></app-float-button>
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
  imports: [GroupUserListComponent, FloatButtonComponent, TranslocoPipe, KpTableLayoutComponent, MatSlideToggle],
})
export class GroupUsersPageComponent implements OnInit, OnDestroy {
  readonly groupUsers: Signal<GroupUser[]>;
  readonly isLoading: Signal<boolean>;
  readonly total: Signal<number>;
  readonly currentPage: Signal<number>;
  readonly perPage: Signal<number>;

  constructor(
    private _dialog: MatDialog,
    private store: Store,
    private _route: ActivatedRoute,
  ) {
    this.groupUsers = toSignal(this.store.select(fromSelectors.selectAll));
    this.isLoading = toSignal(this.store.select(fromSelectors.selectIsLoading));
    this.total = toSignal(this.store.select(fromSelectors.selectTotal));
    this.currentPage = toSignal(this.store.select(fromSelectors.selectCurrentPage));
    this.perPage = toSignal(this.store.select(fromSelectors.selectPerPage));
  }

  ngOnInit(): void {
    this._route.parent?.parent?.params
      .pipe(tap(({ id }) => this.store.dispatch(fromActions.init({ groupId: id }))))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromActions.clearCache());
  }

  openDialog(): void {
    const dialogRef = this._dialog.open<GroupUserCreateComponent, any, GroupSubmitData>(GroupUserCreateComponent, {
      width: '90vw',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap((result) => {
          const { selectedItems, enrollment } = result;
          this.store.dispatch(
            fromActions.addGroupUsers({
              userIds: selectedItems,
              enrollment,
            }),
          );
        }),
      )
      .subscribe();
  }

  onRemove({ id, userId }: { id: string; userId: string }): void {
    const dialogRef = this._dialog.open<RemoveDialogComponent, any, RemoveDialogActionData>(RemoveDialogComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => !!result?.ok))
      .subscribe((result: RemoveDialogActionData | undefined) =>
        this.store.dispatch(
          fromActions.deleteGroupUser({
            userId,
            id,
            removeEnrollments: result?.removeEnrollments,
          }),
        ),
      );
  }

  applyFilter(search: string): void {
    this.store.dispatch(fromActions.filter({ search }));
  }

  onSort(event: any): void {
    this.store.dispatch(fromActions.order({ ordering: event?.ordering || null }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.store.dispatch(fromActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  }

  filterByDeletedUsers(deleted: boolean): void {
    this.store.dispatch(fromActions.filterByDeletedUsers({ deleted }));
  }
}
