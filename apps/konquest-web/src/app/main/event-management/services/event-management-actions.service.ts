import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Mission, MissionInformationDate, MissionModel } from '@app/main/mission/mission.model';
import { KonquestAPI } from '@core/api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { tap } from 'rxjs';
import { ImportListDialogComponent } from '../containers/import-list-dialog/import-list-dialog.component';
import { EventManagementAction } from '../models/actions';
import { EventQrCodeService } from './event-qr-code.service';

@Injectable({
  providedIn: 'root',
})
export class EventManagementActionsService {
  constructor(
    private readonly eventQrCodeService: EventQrCodeService,
    private readonly router: Router,
    private readonly konquestApi: KonquestAPI,
    private readonly messageService: KpMessageService,
    private readonly dialog: MatDialog,
  ) {}

  executeAction(action: EventManagementAction, event: Mission, dates?: MissionInformationDate[]) {
    if (action === 'qr-code') {
      this.eventQrCodeService.openQrCodeDialog();
      return;
    }

    if (action === 'edit') {
      this.router.navigate([`/events/create/${event.id}/info`]);
      return;
    }

    if (action === 'finish') {
      this.finishEvent(event);
      return;
    }

    if (action === 'import-list') {
      this.importList(event.id, dates);
      return;
    }

    if (action === 'print-list') {
      this.printList(event);
      return;
    }

    console.warn(`Unknown event management action: ${action}`);
  }

  private finishEvent(event: Mission) {
    const endpoint = event.mission_model === MissionModel.PRESENTIAL ? 'presential' : 'live';
    this.konquestApi
      .post(`/missions/${endpoint}/${event.id}/complete`, {})
      .pipe(
        tap({
          next: () => {
            this.messageService.success('MISSION.SUCCESSFULLY_COMPLETED');
            this.router.navigate(['/management/events']);
          },
        }),
      )
      .subscribe();
  }

  private importList(eventId: string, dates: MissionInformationDate[]) {
    this.dialog.open(ImportListDialogComponent, {
      autoFocus: 'dialog',
      data: { eventId, dates },
    });
  }

  private printList(event: Mission) {
    const endpoint = event.mission_model === MissionModel.PRESENTIAL ? 'presential' : 'live';
    this.konquestApi
      .post<{
        name: string;
        url: string;
      }>(`/mission-enrollments/${endpoint}-attendances-report/`, { mission_id: event.id })
      .subscribe(({ url }) => window.open(url));
  }
}
