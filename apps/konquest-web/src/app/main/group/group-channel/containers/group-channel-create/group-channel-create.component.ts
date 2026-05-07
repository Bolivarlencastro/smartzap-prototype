import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from '@app/main/channel/channel.model';
import { Store } from '@ngrx/store';
import { GroupSubmitData } from 'app/main/group/shared/group-shared.model';
import { ChannelActions } from 'app/shared/store';
import { ChannelSelectors } from 'app/shared/store/selectors';
import { Observable } from 'rxjs';
import { VinculateListColumnDefinition } from '@keeps-platform-frontend-workspace/ui/kp-vinculate-list';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { GroupVinculationSelectionManager } from 'app/main/group/shared/utils/group-vinculation-selection-manager';
import { KpGroupLinkedDialogHeaderComponent } from '@keeps-platform-frontend-workspace/ui/kp-group-linked-dialog-header';
import { GroupLinkedDialogContentComponent, GroupLinkedDialogFooterComponent } from '../../../shared/components';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

marker('GROUP_CHANNEL.SELECTION_LABEL.PLURAL');
marker('GROUP_CHANNEL.SELECTION_LABEL.SINGULAR');

@Component({
  selector: 'app-group-channel-create',
  templateUrl: './group-channel-create.component.html',
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
export class GroupChannelCreateComponent extends GroupVinculationSelectionManager implements OnInit, OnDestroy {
  items$!: Observable<Channel[]>;
  isLoading$!: Observable<boolean>;
  total$!: Observable<number>;
  page$!: Observable<number>;
  search = '';

  columns: VinculateListColumnDefinition<Channel>[] = [
    { property: 'name', title: marker('GROUP_CHANNEL.TABLE.TITLE.NAME') },
  ];

  constructor(
    private _dialogRef: MatDialogRef<GroupChannelCreateComponent, GroupSubmitData>,
    private store: Store,
  ) {
    super();
  }

  ngOnInit(): void {
    this.items$ = this.store.select(ChannelSelectors.selectAll);
    this.isLoading$ = this.store.select(ChannelSelectors.selectIsLoading);
    this.total$ = this.store.select(ChannelSelectors.selectTotal);
    this.page$ = this.store.select(ChannelSelectors.selectPage);
    this.store.dispatch(
      ChannelActions.loadChannels({
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
    this.store.dispatch(ChannelActions.clearCache());
  }

  onSubmit(): void {
    const data: GroupSubmitData = {
      selectedItems: this.selectedIds,
    };
    this._dialogRef.close(data);
  }

  onScroll(page: number): void {
    this.store.dispatch(
      ChannelActions.loadChannels({
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
      ChannelActions.filterChannels({
        queryParams: { ordering: 'name', per_page: '15', page: '1', search },
      }),
    );
  }
}
