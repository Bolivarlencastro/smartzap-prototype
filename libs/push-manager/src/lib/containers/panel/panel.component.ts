import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PmPushHistoryComponent } from '../../components/pm-push-history/pm-push-history.component';
import { PmSummaryCardComponent } from '../../components/pm-summary-card/pm-summary-card.component';
import { PmUpcomingAppointmentsComponent } from '../../components/pm-upcoming-appointments/pm-upcoming-appointments.component';
import { PanelViewModel } from '../../models/panel';
import { PanelActions, panelFeature } from '../../store';

@Component({
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslocoPipe,
    NgxSkeletonLoaderModule,
    PmSummaryCardComponent,
    DecimalPipe,
    PmUpcomingAppointmentsComponent,
    PmPushHistoryComponent,
  ],
  template: `
    @let loading = this.vm()?.loading;
    @let summary = this.vm()?.data?.summary;
    @let upcomingAppointments = this.vm()?.data?.upcomingAppointments;
    @let pushHistory = this.vm()?.data?.pushHistory;

    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col">
        <span class="text-2xl">{{ 'PUSH_MANAGER.PANEL.TITLE' | transloco }}</span>
        <span class="text-sm">{{ 'PUSH_MANAGER.PANEL.SUBTITLE' | transloco }}</span>
      </div>
      <button matButton="filled" class="flex items-center" (click)="goToCreation()">
        <mat-icon>add</mat-icon>
        <span class="text-xs">{{ 'PUSH_MANAGER.PANEL.NEW_PUSH_BUTTON' | transloco }}</span>
      </button>
    </div>

    <div class="grid grid-cols-[repeat(auto-fit,_minmax(288px,_1fr))] gap-5 w-full">
      @if (loading) {
        @for (i of [0, 1, 2]; track i) {
          <ngx-skeleton-loader
            count="1"
            animation="pulse"
            [theme]="{ height: '7rem', 'border-radius': '1rem', 'margin-bottom': '0' }"
          ></ngx-skeleton-loader>
        }
      } @else {
        <pm-summary-card [title]="'PUSH_MANAGER.PANEL.SUMMARY_CARD.TOTAL_SENDS' | transloco" icon="notifications">{{
          summary?.pushCount | number: '1.0-0'
        }}</pm-summary-card>
        <pm-summary-card [title]="'PUSH_MANAGER.PANEL.SUMMARY_CARD.TOTAL_INVESTIMENT' | transloco" icon="attach_money"
          >R$ {{ summary?.totalInvestiment | number: '1.2-2' }}</pm-summary-card
        >
        <pm-summary-card [title]="'PUSH_MANAGER.PANEL.SUMMARY_CARD.ROI_ENROLLMENT' | transloco" icon="finance"
          >R$ {{ summary?.roiEnrollment | number: '1.2-2' }}</pm-summary-card
        >
      }
    </div>

    <div class="flex flex-col gap-7 w-full">
      @if (loading) {
        @for (i of [0, 1]; track i) {
          <ngx-skeleton-loader
            count="1"
            animation="pulse"
            [theme]="{ height: '280px', 'border-radius': '1rem', 'margin-bottom': '0' }"
          ></ngx-skeleton-loader>
        }
      } @else {
        <pm-upcoming-appointments
          [data]="upcomingAppointments"
          (removePush)="removePush($event)"
        ></pm-upcoming-appointments>
        <pm-push-history [data]="pushHistory"></pm-push-history>
      }
    </div>
  `,
  styles: `
    :host {
      @apply p-9 flex flex-col gap-7 justify-center items-center w-full mx-auto;

      max-width: 1050px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  vm: Signal<PanelViewModel>;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
    store.dispatch(PanelActions.loadPanelData());
    this.vm = toSignal(store.select(panelFeature.selectViewModel));
  }

  goToCreation() {
    this.router.navigate(['/push-manager/creation']);
  }

  removePush(id: string) {
    this.store.dispatch(PanelActions.removePush({ id }));
  }
}
