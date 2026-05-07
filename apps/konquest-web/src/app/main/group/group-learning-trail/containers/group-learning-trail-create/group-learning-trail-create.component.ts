import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GroupSubmitData } from 'app/main/group/shared/group-shared.model';
import { CyclesActions, cyclesFeature, LearningTrailActions } from 'app/shared/store';
import { LearningTrailSelectors } from 'app/shared/store/selectors';
import { Observable } from 'rxjs';
import { LearningTrail } from 'app/main/learning-trail/model/learning-trail';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { GroupVinculationSelectionManager } from 'app/main/group/shared/utils/group-vinculation-selection-manager';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { VinculateListColumnDefinition } from '@keeps-platform-frontend-workspace/ui/kp-vinculate-list';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { KpGroupLinkedDialogHeaderComponent } from '@keeps-platform-frontend-workspace/ui/kp-group-linked-dialog-header';
import { GroupLinkedDialogContentComponent, GroupLinkedDialogFooterComponent } from '../../../shared/components';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

marker('GROUP_LEARNING_TRAIL.SELECTION_LABEL.PLURAL');
marker('GROUP_LEARNING_TRAIL.SELECTION_LABEL.SINGULAR');

@Component({
  selector: 'app-group-learning-trail-create',
  templateUrl: './group-learning-trail-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KpGroupLinkedDialogHeaderComponent,
    GroupLinkedDialogContentComponent,
    GroupLinkedDialogFooterComponent,
    AsyncPipe,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
})
export class GroupLearningTrailCreateComponent extends GroupVinculationSelectionManager implements OnInit, OnDestroy {
  items$!: Observable<any[]>;
  isLoading$!: Observable<boolean>;
  total$!: Observable<number>;
  page$!: Observable<number>;
  cycles$!: Observable<CycleDto[]>;
  search = '';

  columns: VinculateListColumnDefinition<LearningTrail>[] = [
    { property: 'name', title: marker('GROUP_LEARNING_TRAIL.TABLE.TITLE.NAME') },
  ];

  constructor(
    private _dialogRef: MatDialogRef<GroupLearningTrailCreateComponent, GroupSubmitData>,
    private store: Store,
  ) {
    super();
  }

  ngOnInit(): void {
    this.items$ = this.store.select(LearningTrailSelectors.selectAll);
    this.isLoading$ = this.store.select(LearningTrailSelectors.selectIsLoading);
    this.total$ = this.store.select(LearningTrailSelectors.selectTotal);
    this.page$ = this.store.select(LearningTrailSelectors.selectPage);
    this.cycles$ = this.store.select(cyclesFeature.selectAll);
    this.store.dispatch(
      LearningTrailActions.loadLearningTrails({
        queryParams: {
          ordering: 'name',
          per_page: '15',
          page: '1',
          search: this.search,
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(LearningTrailActions.clearCache());
  }

  onSubmit(enrollment?: EnrollmentConfig): void {
    const data: GroupSubmitData = {
      selectedItems: this.selectedIds,
      enrollment: enrollment,
    };
    this._dialogRef.close(data);
  }

  onScroll(page: number): void {
    this.store.dispatch(
      LearningTrailActions.loadLearningTrails({
        queryParams: {
          ordering: 'name',
          per_page: '15',
          page,
          search: this.search,
        },
      }),
    );
  }

  applyFilter(search: string): void {
    this.search = search;
    this.store.dispatch(
      LearningTrailActions.filterLearningTrails({
        queryParams: { ordering: 'name', per_page: '15', page: '1', search },
      }),
    );
  }

  onFilterCycle(search: string) {
    this.store.dispatch(CyclesActions.filterCycles({ search }));
  }
}
