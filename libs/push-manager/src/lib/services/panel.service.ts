import { Injectable } from '@angular/core';
import {
  Paginated,
  PushCampaignModel,
  PushCampaignParamsModel,
  PushManagerApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { filter, forkJoin, map, Observable, switchMap } from 'rxjs';
import { PmAddCreditsDialogComponent } from '../components/pm-add-credits-dialog/pm-add-credits-dialog.component';
import { SummaryModel } from '../models/panel';

@Injectable()
export class PanelService {
  constructor(
    private readonly api: PushManagerApi,
    private readonly dialog: MatDialog,
  ) {}

  fetchSummary(): Observable<SummaryModel> {
    return forkJoin([this.api.fetchBalance(), this.api.fetchGeneralStats()]).pipe(
      map(([balance, stats]) => ({
        pushCount: stats.total_dispatches,
        totalInvestiment: stats.total_investment,
        currentBalance: balance.balance,
      })),
    );
  }

  fetchUpcomingAppointments(params: Omit<PushCampaignParamsModel, 'status'>): Observable<Paginated<PushCampaignModel>> {
    return this.api.fetchCampaigns({ ...params, status: ['SCHEDULED'] });
  }

  fetchPushHistory(params: Omit<PushCampaignParamsModel, 'status'>): Observable<Paginated<PushCampaignModel>> {
    return this.api.fetchCampaigns({ ...params, status: ['PROCESSING', 'COMPLETED', 'FAILED', 'CANCELED'] });
  }

  openAddCreditsDialog(currentBalance: string): Observable<boolean> {
    const dialogRef = this.dialog.open(PmAddCreditsDialogComponent, {
      autoFocus: 'dialog',
      data: { currentBalance },
    });
    return dialogRef.afterClosed().pipe(filter(Boolean));
  }

  cancelCampaign(id: string): Observable<void> {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.CANCEL_DIALOG.TITLE';
    dialogRef.componentInstance.confirmMessage = 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.CANCEL_DIALOG.MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel =
      'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.CANCEL_DIALOG.CONFIRM_BUTTON';
    return dialogRef.afterClosed().pipe(
      filter(Boolean),
      switchMap(() => this.api.cancelCampaign(id)),
    );
  }
}
