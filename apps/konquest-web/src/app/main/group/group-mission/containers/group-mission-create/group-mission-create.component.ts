import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GroupSubmitData } from 'app/main/group/shared/group-shared.model';
import { Mission } from 'app/main/mission/mission.model';
import { CyclesActions, cyclesFeature, MissionActions } from 'app/shared/store';
import { MissionSelectors } from 'app/shared/store/selectors';
import { Observable } from 'rxjs';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { GroupVinculationSelectionManager } from 'app/main/group/shared/utils/group-vinculation-selection-manager';
import { CycleDto, DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { VinculateListColumnDefinition } from '@keeps-platform-frontend-workspace/ui/kp-vinculate-list';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { KpGroupLinkedDialogHeaderComponent } from '@keeps-platform-frontend-workspace/ui/kp-group-linked-dialog-header';
import { GroupLinkedDialogContentComponent, GroupLinkedDialogFooterComponent } from '../../../shared/components';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

marker('GROUP_MISSION.SELECTION_LABEL.PLURAL');
marker('GROUP_MISSION.SELECTION_LABEL.SINGULAR');

@Component({
  selector: 'app-group-mission-create',
  templateUrl: './group-mission-create.component.html',
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
export class GroupMissionCreateComponent extends GroupVinculationSelectionManager implements OnInit, OnDestroy {
  items$!: Observable<Mission[]>;
  isLoading$!: Observable<boolean>;
  total$!: Observable<number>;
  page$!: Observable<number>;
  cycles$!: Observable<CycleDto[]>;
  search = '';

  columns: VinculateListColumnDefinition<Mission>[] = [
    { property: 'name', title: marker('GROUP_MISSION.TABLE.TITLE.NAME') },
  ];

  constructor(
    private _dialogRef: MatDialogRef<GroupMissionCreateComponent, GroupSubmitData>,
    private store: Store,
  ) {
    super();
  }

  ngOnInit(): void {
    this.items$ = this.store.select(MissionSelectors.selectAll);
    this.isLoading$ = this.store.select(MissionSelectors.selectIsLoading);
    this.total$ = this.store.select(MissionSelectors.selectTotal);
    this.page$ = this.store.select(MissionSelectors.selectPage);
    this.cycles$ = this.store.select(cyclesFeature.selectAll);
    this.store.dispatch(
      MissionActions.loadMissions({
        queryParams: {
          ordering: 'name',
          per_page: '15',
          page: '1',
          search: this.search,
          development_status: DevelopmentStatus.DONE,
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(MissionActions.clearCache());
  }

  onSubmit(enrollment?: EnrollmentConfig): void {
    const data: GroupSubmitData = {
      selectedItems: this.selectedIds,
      enrollment,
    };
    this._dialogRef.close(data);
  }

  onScroll(page: number): void {
    this.store.dispatch(
      MissionActions.loadMissions({
        queryParams: {
          ordering: 'name',
          per_page: '15',
          page,
          search: this.search,
          development_status: DevelopmentStatus.DONE,
        },
      }),
    );
  }

  applyFilter(search: string): void {
    this.search = search;
    this.store.dispatch(
      MissionActions.filterMissions({
        queryParams: {
          ordering: 'name',
          per_page: '15',
          page: '1',
          search,
          development_status: DevelopmentStatus.DONE,
        },
      }),
    );
  }

  onFilterCycle(search: string) {
    this.store.dispatch(CyclesActions.filterCycles({ search }));
  }
}
