import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '@core/model';
import { Store } from '@ngrx/store';
import { CyclesActions, cyclesFeature, UserActions } from 'app/shared/store';
import { UserSelectors } from 'app/shared/store/selectors';
import { Observable } from 'rxjs';
import { GroupSubmitData } from 'app/main/group/shared/group-shared.model';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { GroupVinculationSelectionManager } from 'app/main/group/shared/utils/group-vinculation-selection-manager';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { VinculateListColumnDefinition } from '@keeps-platform-frontend-workspace/ui/kp-vinculate-list';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { KpGroupLinkedDialogHeaderComponent } from '@keeps-platform-frontend-workspace/ui/kp-group-linked-dialog-header';
import { GroupLinkedDialogContentComponent, GroupLinkedDialogFooterComponent } from 'app/main/group/shared/components';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

marker('GROUP_USER.SELECTION_LABEL.PLURAL');
marker('GROUP_USER.SELECTION_LABEL.SINGULAR');

@Component({
  selector: 'app-group-user-create',
  templateUrl: './group-user-create.component.html',
  styles: [
    `
      app-group-user-create {
        .mat-column-name {
          max-width: 360px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [
    KpGroupLinkedDialogHeaderComponent,
    GroupLinkedDialogContentComponent,
    GroupLinkedDialogFooterComponent,
    AsyncPipe,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
})
export class GroupUserCreateComponent extends GroupVinculationSelectionManager implements OnInit, OnDestroy {
  items$!: Observable<User[]>;
  isLoading$!: Observable<boolean>;
  total$!: Observable<number>;
  page$!: Observable<number>;
  cycles$!: Observable<CycleDto[]>;
  isNormativeActive$: Observable<boolean>;
  search = '';

  columns: VinculateListColumnDefinition<User>[] = [
    { property: 'name', title: marker('GROUP_USER.TABLE.TITLE.NAME') },
    { property: 'email', title: marker('GROUP_USER.TABLE.TITLE.EMAIL') },
  ];

  constructor(
    private _dialogRef: MatDialogRef<GroupUserCreateComponent, GroupSubmitData>,
    private store: Store,
  ) {
    super();
  }

  ngOnInit(): void {
    this.items$ = this.store.select(UserSelectors.selectAll);
    this.isLoading$ = this.store.select(UserSelectors.selectIsLoading);
    this.total$ = this.store.select(UserSelectors.selectTotal);
    this.page$ = this.store.select(UserSelectors.selectPage);
    this.cycles$ = this.store.select(cyclesFeature.selectAll);
    this.isNormativeActive$ = this.store.select(cyclesFeature.selectIsNormativeActive);
    this.store.dispatch(
      UserActions.loadUsers({
        queryParams: {
          sortBy: 'name:ASC',
          limit: 15,
          page: 1,
          search: this.search,
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(UserActions.clearCache());
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
      UserActions.loadUsers({
        queryParams: {
          sortBy: 'name:ASC',
          limit: 15,
          page,
          search: this.search,
        },
      }),
    );
  }

  applyFilter(search: string): void {
    this.search = search;
    this.store.dispatch(UserActions.applyUserFilter({ search }));
  }

  onFilterCycle(search: string) {
    this.store.dispatch(CyclesActions.filterCycles({ search }));
  }
}
