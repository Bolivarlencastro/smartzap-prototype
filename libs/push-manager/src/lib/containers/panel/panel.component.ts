import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { PmPanelSideMenuComponent } from '../../components/pm-panel-side-menu/pm-panel-side-menu.component';
import { PmPushHistoryComponent } from '../../components/pm-push-history/pm-push-history.component';
import { PmUpcomingAppointmentsComponent } from '../../components/pm-upcoming-appointments/pm-upcoming-appointments.component';
import { SummaryModel } from '../../models/panel';
import {
  PanelActions,
  PushHistoryActions,
  UpcomingAppointmentsActions,
  panelFeature,
  pushHistoryFeature,
  upcomingAppointmentsFeature,
} from '../../store';
import { PushHistoryState } from '../../store/features/push-history.feature';
import { UpcomingAppointmentsViewModel } from '../../store/features/upcoming-appointments.feature';

@Component({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    TranslocoPipe,
    PmPanelSideMenuComponent,
    PmUpcomingAppointmentsComponent,
    PmPushHistoryComponent,
  ],
  template: `
    @let summaryData = this.summary()?.data;
    @let appointments = this.appointments();
    @let history = this.pushHistory();

    <mat-drawer-container class="blank grow min-h-0" autosize>
      <mat-drawer #drawer class="h-full" mode="side" position="end">
        <pm-panel-side-menu [summary]="summaryData" (closeMenu)="drawer.toggle()" />
      </mat-drawer>

      <div class="h-full flex flex-col">
        <div class="h-32 flex items-center pl-8 pr-4">
          <div class="flex flex-col">
            <span class="text-2xl">{{ 'PUSH_MANAGER.PANEL.TITLE' | transloco }}</span>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <button matButton="outlined" class="flex items-center" (click)="onAddCredits()">
              <mat-icon>add_card</mat-icon>
              <span class="text-xs">{{ 'PUSH_MANAGER.PANEL.ADD_CREDITS_BUTTON' | transloco }}</span>
            </button>
            <button matButton="filled" class="flex items-center" (click)="goToCreation()">
              <mat-icon>add</mat-icon>
              <span class="text-xs">{{ 'PUSH_MANAGER.PANEL.NEW_PUSH_BUTTON' | transloco }}</span>
            </button>
            <button mat-icon-button (click)="drawer.toggle()">
              <mat-icon class="text-primary">analytics</mat-icon>
            </button>
          </div>
        </div>

        <mat-tab-group class="grow min-h-0" mat-stretch-tabs="false" animationDuration="0ms">
          <mat-tab>
            <ng-template matTabLabel>
              <mat-icon class="mr-2">event</mat-icon>
              {{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.TITLE' | transloco }}
            </ng-template>
            <pm-upcoming-appointments
              [data]="appointments?.data"
              [total]="appointments?.total ?? 0"
              [page]="appointments?.page ?? 1"
              [limit]="appointments?.limit ?? 10"
              (searchChange)="onAppointmentsSearch($event)"
              (sortChange)="onAppointmentsSort($event)"
              (pageChange)="onAppointmentsPage($event)"
              (cancelPush)="onCancelPush($event)"
            ></pm-upcoming-appointments>
          </mat-tab>

          <mat-tab>
            <ng-template matTabLabel>
              <mat-icon class="mr-2">history</mat-icon>
              {{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.TITLE' | transloco }}
            </ng-template>
            <pm-push-history
              [data]="history?.data"
              [total]="history?.total ?? 0"
              [page]="history?.page ?? 1"
              [limit]="history?.limit ?? 10"
              (searchChange)="onHistorySearch($event)"
              (sortChange)="onHistorySort($event)"
              (pageChange)="onHistoryPage($event)"
            ></pm-push-history>
          </mat-tab>
        </mat-tab-group>
      </div>
    </mat-drawer-container>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;

      --mat-sidenav-container-width: 322px;
    }

    :host ::ng-deep .mat-mdc-tab-label-container {
      padding-left: 2rem;
    }

    :host ::ng-deep .mat-mdc-tab-body-wrapper {
      flex: 1 1 0;
      min-height: 0;
    }

    :host ::ng-deep .mat-mdc-tab-body-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  summary: Signal<{ data: SummaryModel | null; loading: boolean }>;
  appointments: Signal<UpcomingAppointmentsViewModel>;
  pushHistory: Signal<PushHistoryState>;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
    store.dispatch(PanelActions.loadSummary());
    store.dispatch(UpcomingAppointmentsActions.load());
    store.dispatch(PushHistoryActions.load());

    this.summary = toSignal(store.select(panelFeature.selectSummary));
    this.appointments = toSignal(store.select(upcomingAppointmentsFeature.selectAppointmentsView));
    this.pushHistory = toSignal(store.select(pushHistoryFeature.selectPmPushHistoryState));
  }

  goToCreation() {
    this.router.navigate(['/push-manager/creation']);
  }

  onAddCredits() {
    this.store.dispatch(PanelActions.openAddCreditsDialog());
  }

  onCancelPush(id: string) {
    this.store.dispatch(UpcomingAppointmentsActions.cancelPush({ id }));
  }

  onAppointmentsSearch(search: string) {
    this.store.dispatch(UpcomingAppointmentsActions.search({ search }));
  }

  onAppointmentsSort(event: Sort) {
    const sortBy = event.active && event.direction ? [`${event.active}:${event.direction}`] : [];
    this.store.dispatch(UpcomingAppointmentsActions.sort({ sortBy }));
  }

  onAppointmentsPage(event: PageEvent) {
    this.store.dispatch(UpcomingAppointmentsActions.changePage({ page: event.pageIndex + 1, limit: event.pageSize }));
  }

  onHistorySearch(search: string) {
    this.store.dispatch(PushHistoryActions.search({ search }));
  }

  onHistorySort(event: Sort) {
    const sortBy = event.active && event.direction ? [`${event.active}:${event.direction}`] : [];
    this.store.dispatch(PushHistoryActions.sort({ sortBy }));
  }

  onHistoryPage(event: PageEvent) {
    this.store.dispatch(PushHistoryActions.changePage({ page: event.pageIndex + 1, limit: event.pageSize }));
  }
}
