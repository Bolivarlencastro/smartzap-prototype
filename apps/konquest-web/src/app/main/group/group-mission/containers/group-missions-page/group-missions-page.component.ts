import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs/operators';
import * as fromActions from '../../store/group-mission.actions';
import { GroupMission } from '../../group-mission.model';
import * as fromSelectors from '../../store/group-mission.selectors';
import { GroupMissionCreateComponent } from 'app/main/group/group-mission/containers';
import { GroupSubmitData } from 'app/main/group/shared/group-shared.model';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { GroupMissionListComponent } from '../../components/group-mission-list/group-mission-list.component';
import { FloatButtonComponent } from '../../../../../shared/components/float-button/float-button.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-missions-page',
  template: `
    <kp-table-layout
      class="grow"
      [totalItems]="total()"
      [pageIndex]="currentPage()"
      [pageSize]="perPage()"
      (pageChange)="onPageChange($event)"
      (searchChange)="applyFilter($event)"
    >
      <app-group-mission-list
        kpTable
        [data]="groupMissions()"
        [isLoading]="isLoading()"
        (sortEvent)="onSort($event)"
        (removeEvent)="onRemove($event)"
      ></app-group-mission-list>
    </kp-table-layout>
    <app-float-button
      [tooltip]="'GROUP_MISSION.BUTTON.CREATE' | transloco"
      (clickEvent)="openDialog()"
    ></app-float-button>
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
  imports: [GroupMissionListComponent, FloatButtonComponent, TranslocoPipe, KpTableLayoutComponent],
})
export class GroupMissionsPageComponent implements OnInit, OnDestroy {
  readonly groupMissions: Signal<GroupMission[]>;
  readonly isLoading: Signal<boolean>;
  readonly total: Signal<number>;
  readonly currentPage: Signal<number>;
  readonly perPage: Signal<number>;

  selectedGroup!: string;
  term = '';
  ordering: string | null = null;

  constructor(
    private _dialog: MatDialog,
    private store: Store,
    private _route: ActivatedRoute,
  ) {
    this.groupMissions = toSignal(this.store.select(fromSelectors.selectAll));
    this.isLoading = toSignal(this.store.select(fromSelectors.selectIsLoading));
    this.total = toSignal(this.store.select(fromSelectors.selectTotal));
    this.currentPage = toSignal(this.store.select(fromSelectors.selectCurrentPage));
    this.perPage = toSignal(this.store.select(fromSelectors.selectPerPage));
  }

  ngOnInit(): void {
    this._route.parent?.parent?.params
      .pipe(
        tap(({ id }) => {
          this.selectedGroup = id;
          this.store.dispatch(fromActions.filterGroupMissions({ id, queryParams: { page: 1, per_page: 10 } }));
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromActions.clearCache());
  }

  onRemove({ id, missionId }: { id: string; missionId: string }): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = 'GROUP_MISSION.DIALOG.REMOVE_MISSION_TITLE';
    dialogRef.componentInstance.confirmMessage = 'GROUP_MISSION.DIALOG.REMOVE_MISSION_MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() =>
          this.store.dispatch(
            fromActions.deleteGroupMission({
              groupId: this.selectedGroup,
              missionId,
              id,
            }),
          ),
        ),
      )
      .subscribe();
  }

  applyFilter(searchTerm: string): void {
    this.term = searchTerm;
    this.store.dispatch(
      fromActions.filterGroupMissions({
        id: this.selectedGroup,
        queryParams: { page: 1, per_page: this.perPage(), search: this.term, ordering: this.ordering },
      }),
    );
  }

  onSort(event: any): void {
    this.ordering = event?.ordering ?? null;
    this.store.dispatch(
      fromActions.filterGroupMissions({
        id: this.selectedGroup,
        queryParams: { page: 1, per_page: this.perPage(), search: this.term, ordering: this.ordering },
      }),
    );
  }

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.store.dispatch(
      fromActions.filterGroupMissions({
        id: this.selectedGroup,
        queryParams: { page: pageIndex + 1, per_page: pageSize, search: this.term, ordering: this.ordering },
      }),
    );
  }

  openDialog(): void {
    const dialogRef = this._dialog.open<GroupMissionCreateComponent, any, GroupSubmitData>(
      GroupMissionCreateComponent,
      {
        width: '90vw',
        autoFocus: false,
        disableClose: true,
      },
    );
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap((result) => {
          if (result) {
            const { selectedItems, enrollment } = result;
            this.store.dispatch(
              fromActions.addGroupMissions({
                groupMissionData: {
                  groupId: this.selectedGroup,
                  missionIds: selectedItems,
                  enrollment,
                },
              }),
            );
          }
        }),
      )
      .subscribe();
  }
}
