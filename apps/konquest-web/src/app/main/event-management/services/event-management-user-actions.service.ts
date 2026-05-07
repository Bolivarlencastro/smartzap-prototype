import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MissionModel } from '@app/main/mission/mission.model';
import { KonquestAPI } from '@core/api';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { filter, switchMap, tap } from 'rxjs';
import { AddNoteComponent } from '../components/add-note/add-note.component';

@Injectable()
export class EventManagementUserActionsService {
  constructor(
    private readonly konquestApi: KonquestAPI,
    private readonly messageService: KpMessageService,
    private readonly dialog: MatDialog,
  ) {}

  addNote(presenceId: string | string[], observation: string, mission_model: MissionModel, batch: boolean) {
    const endpoint = mission_model === MissionModel.PRESENTIAL ? 'presential-attendances' : 'live-attendances';

    return this.dialog
      .open(AddNoteComponent, { width: '400px', data: observation })
      .afterClosed()
      .pipe(
        filter((value) => value),
        switchMap((result) => {
          const request = batch
            ? this.konquestApi.post(`/mission-enrollments/${endpoint}/batch-check`, {
                observation: result,
                attendance_ids: presenceId,
              })
            : this.konquestApi.post(`/mission-enrollments/${endpoint}/${presenceId}/check`, { observation: result });

          return request.pipe(
            tap({ next: () => this.messageService.success('EVENT_MANAGEMENT.ADD_NOTE.SUCCESS_MESSAGE') }),
          );
        }),
      );
  }

  togglePresence(presented: boolean, presenceId: string | string[], mission_model: MissionModel, batch: boolean) {
    const endpoint = mission_model === MissionModel.PRESENTIAL ? 'presential-attendances' : 'live-attendances';
    const request = batch
      ? this.konquestApi.post(`/mission-enrollments/${endpoint}/batch-check`, { presented, attendance_ids: presenceId })
      : this.konquestApi.post(`/mission-enrollments/${endpoint}/${presenceId}/check`, { presented });

    return request.pipe(
      tap({ next: () => this.messageService.success('MISSION.ATTENDANCE_LIST.UPDATE_PRESENTED_SUCCESS') }),
    );
  }

  sendInvite(enrollment_ids: string[]) {
    return this.konquestApi.post('/mission-enrollments/batch-resend-invite', { enrollment_ids }).pipe(
      tap({
        next: () => {
          this.messageService.success('EVENT_MANAGEMENT.SEND_INVITE.SUCCESS_MESSAGE');
        },
      }),
    );
  }

  removeUser(id: string | string[], batch: boolean) {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = 'EVENT_MANAGEMENT.REMOVE_USER.TITLE';
    dialogRef.componentInstance.confirmMessage = 'EVENT_MANAGEMENT.REMOVE_USER.DESCRIPTION';
    dialogRef.componentInstance.positiveButtonLabel = 'EVENT_MANAGEMENT.REMOVE_USER.POSITIVE_BUTTON';

    return dialogRef.afterClosed().pipe(
      filter((value) => value === true),
      switchMap(() => {
        const request = batch
          ? this.konquestApi.post('/mission-enrollments/batch-delete', { enrollment_ids: id })
          : this.konquestApi.delete(`/mission-enrollments/${id}`);

        return request.pipe(
          tap({ next: () => this.messageService.success('EVENT_MANAGEMENT.REMOVE_USER.SUCCESS_MESSAGE') }),
        );
      }),
    );
  }
}
