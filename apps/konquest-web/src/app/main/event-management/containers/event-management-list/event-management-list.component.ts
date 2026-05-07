import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, computed, model, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MissionEnrollmentAttendance } from '@app/main/mission/mission.model';
import { TranslocoModule } from '@jsverse/transloco';
import { BatchAction } from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpBatchActionSelectionComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-selection';
import { KpPhonePipe } from '@keeps-platform-frontend-workspace/ui/kp-phone';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { tap } from 'rxjs';
import { EventManagementViewModel } from '../../models/view-model';
import { EventManagementUserActions } from '../../store/actions';
import { eventManagementFeature } from '../../store/features';

@Component({
  selector: 'app-event-management-list',
  imports: [
    TranslocoModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSlideToggleModule,
    KpPhonePipe,
    NgxSkeletonLoaderModule,
    KpBatchActionSelectionComponent,
    MatCheckboxModule,
  ],
  templateUrl: './event-management-list.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManagementListComponent {
  selection = model<SelectionModel<MissionEnrollmentAttendance>>();
  isFinished: Signal<boolean>;

  protected readonly vm: Signal<EventManagementViewModel>;
  protected readonly displayedColumns: string[] = [
    'select',
    'icon',
    'name',
    'email',
    'phone',
    'note',
    'presence',
    'actions',
  ];
  protected readonly defaultUserAvatar = constants.defaultUserAvatar;
  protected readonly batchActions: Signal<BatchAction[]>;
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(private readonly store: Store) {
    this.vm = toSignal(store.select(eventManagementFeature.selectViewModel).pipe(tap(() => this.clearSelection())));
    this.isFinished = toSignal(store.select(eventManagementFeature.selectIsFinished));
    this.batchActions = this.defineBatchActions();
  }

  onAddNote(user: MissionEnrollmentAttendance) {
    const { id, observation } = user;
    this.store.dispatch(EventManagementUserActions.addNote({ presenceId: id, observation }));
  }

  onTogglePresence({ checked }: MatSlideToggleChange, presenceId: string) {
    this.store.dispatch(EventManagementUserActions.togglePresence({ checked, presenceId }));
  }

  onSendInvite(user: MissionEnrollmentAttendance) {
    const enrollmentId = [user?.enrollment?.id];
    this.store.dispatch(EventManagementUserActions.sendInvite({ enrollmentId }));
  }

  onRemoveUser(user: MissionEnrollmentAttendance) {
    const enrollmentId = user?.enrollment?.id;
    this.store.dispatch(EventManagementUserActions.removeUser({ enrollmentId }));
  }

  onDispatchBatchAction(batchAction: BatchAction) {
    const selected = this.selection()?.selected || [];
    const presenceId = selected.map((item) => item.id);
    const enrollmentId = selected.map((item) => item?.enrollment?.id);

    const ACTIONS_MAP: Partial<Record<BatchAction, any>> = {
      ADD_NOTE: EventManagementUserActions.addNote({ presenceId, observation: null, batch: true }),
      SEND_INVITE: EventManagementUserActions.sendInvite({ enrollmentId }),
      REMOVE_USER: EventManagementUserActions.removeUser({ enrollmentId, batch: true }),
      MARK_AS_ABSENT: EventManagementUserActions.togglePresence({ checked: false, presenceId, batch: true }),
      MARK_AS_PRESENT: EventManagementUserActions.togglePresence({ checked: true, presenceId, batch: true }),
    };

    this.store.dispatch(ACTIONS_MAP[batchAction]);
  }

  isAllSelected(items: MissionEnrollmentAttendance[]): boolean {
    const numSelected = this.selection()?.selected.length;
    const numRows = items.length;
    return numSelected === numRows;
  }

  toggleAllRows(items: MissionEnrollmentAttendance[]) {
    if (this.isAllSelected(items)) {
      this.selection().clear();
      return;
    }

    this.selection().select(...items);
  }

  toggleOneRow(item: MissionEnrollmentAttendance) {
    this.selection().toggle(item);
  }

  clearSelection() {
    this.selection()?.clear();
  }

  private defineBatchActions() {
    return computed(() => {
      const isFinished = this.isFinished();

      if (isFinished) {
        return ['ADD_NOTE', 'REMOVE_USER', 'MARK_AS_ABSENT', 'MARK_AS_PRESENT'] as BatchAction[];
      }

      return ['ADD_NOTE', 'SEND_INVITE', 'REMOVE_USER', 'MARK_AS_ABSENT', 'MARK_AS_PRESENT'] as BatchAction[];
    });
  }
}
