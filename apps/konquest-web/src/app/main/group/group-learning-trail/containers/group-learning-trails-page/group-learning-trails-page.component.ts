import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { GroupSubmitData } from 'app/main/group/shared/group-shared.model';
import { filter, tap } from 'rxjs/operators';
import { GroupLearningTrail } from '../../group-learning-trail.model';
import * as fromActions from '../../store/group-learning-trail.actions';
import * as fromSelectors from '../../store/group-learning-trail.selectors';
import { GroupLearningTrailCreateComponent } from 'app/main/group/group-learning-trail/containers';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { GroupLearningTrailListComponent } from '../../components/group-learning-trail-list/group-learning-trail-list.component';
import { FloatButtonComponent } from '../../../../../shared/components/float-button/float-button.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-learning-trails-page',
  template: `
    <kp-table-layout
      class="grow"
      [totalItems]="total()"
      [pageIndex]="currentPage()"
      [pageSize]="perPage()"
      (pageChange)="onPageChange($event)"
      (searchChange)="applyFilter($event)"
    >
      <app-group-learning-trail-list
        kpTable
        [data]="datasource()"
        [isLoading]="isLoading()"
        (sortEvent)="onSort($event)"
        (removeEvent)="onRemove($event)"
      ></app-group-learning-trail-list>
    </kp-table-layout>
    <app-float-button
      [tooltip]="'GROUP_LEARNING_TRAIL.BUTTON.CREATE' | transloco"
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
  imports: [GroupLearningTrailListComponent, FloatButtonComponent, TranslocoPipe, KpTableLayoutComponent],
})
export class GroupLearningTrailsPageComponent implements OnInit, OnDestroy {
  readonly datasource: Signal<GroupLearningTrail[]>;
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
    this.datasource = toSignal(this.store.select(fromSelectors.selectAll));
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
          this.store.dispatch(fromActions.filterGroupLearningTrails({ id, queryParams: { page: 1, per_page: 10 } }));
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromActions.clearCache());
  }

  onRemove({ id, learningTrailId }: { id: string; learningTrailId: string }): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = 'GROUP_LEARNING_TRAIL.DIALOG.REMOVE_TRAIL_TITLE';
    dialogRef.componentInstance.confirmMessage = 'GROUP_LEARNING_TRAIL.DIALOG.REMOVE_TRAIL_MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() =>
          this.store.dispatch(
            fromActions.deleteGroupLearningTrail({
              groupId: this.selectedGroup,
              learningTrailId,
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
      fromActions.filterGroupLearningTrails({
        id: this.selectedGroup,
        queryParams: { page: 1, per_page: this.perPage(), search: this.term, ordering: this.ordering },
      }),
    );
  }

  onSort(event: any): void {
    this.ordering = event?.ordering ?? null;
    this.store.dispatch(
      fromActions.filterGroupLearningTrails({
        id: this.selectedGroup,
        queryParams: { page: 1, per_page: this.perPage(), search: this.term, ordering: this.ordering },
      }),
    );
  }

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.store.dispatch(
      fromActions.filterGroupLearningTrails({
        id: this.selectedGroup,
        queryParams: { page: pageIndex + 1, per_page: pageSize, search: this.term, ordering: this.ordering },
      }),
    );
  }

  openDialog(): void {
    const dialogRef = this._dialog.open<GroupLearningTrailCreateComponent, any, GroupSubmitData>(
      GroupLearningTrailCreateComponent,
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
              fromActions.addGroupLearningTrails({
                data: {
                  groupId: this.selectedGroup,
                  learningTrailIds: selectedItems,
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
