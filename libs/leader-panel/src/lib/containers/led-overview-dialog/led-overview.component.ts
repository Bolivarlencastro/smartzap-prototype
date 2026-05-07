import { ChangeDetectionStrategy, Component, Inject, OnDestroy, Signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { LedOverViewTabs } from '../../models/led-overview';
import { LedChannelTabComponent } from './led-channel-tab.component';
import { LedEventTabComponent } from './led-event-tab.component';
import { LedPulseTabComponent } from './led-pulse-tab.component';
import { LedCoursesTabComponent } from './led-courses-tab.component';
import { Store } from '@ngrx/store';
import { Led } from '../../models/led';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { LedTrailsTabComponent } from './led-trails-tab.component';
import { LedOverviewTabComponent } from './led-overview-tab.component';
import { LedOverviewActions, ledOverviewFeature } from '../../store/led-overview';

@Component({
  selector: 'lp-led-overview',
  imports: [
    MatDialogTitle,
    MatDialogClose,
    MatIconButton,
    MatIcon,
    MatTabGroup,
    MatTab,
    MatDivider,
    MatTabLabel,
    LedChannelTabComponent,
    LedPulseTabComponent,
    LedEventTabComponent,
    LedCoursesTabComponent,
    MatTabContent,
    TranslocoPipe,
    LedTrailsTabComponent,
    LedOverviewTabComponent,
  ],
  template: `
    @let user = selectedUser();
    <div matDialogTitle class="flex justify-between gap-4">
      <div class="flex items-center gap-4">
        <img [src]="user?.avatar || defaultUserAvatar" class="w-10 h-10 rounded-full object-cover" />
        <div>
          <p class="text-xl">{{ user?.name }}</p>
          <p class="text-xs text-secondary">{{ user?.job_position }}</p>
        </div>
      </div>
      <button matDialogClose matIconButton>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms">
      <mat-tab id="overview">
        <ng-template mat-tab-label>
          <mat-icon class="mr-2">dashboard</mat-icon>
          {{ 'LEADER_PANEL.LED_OVERVIEW.OVERVIEW' | transloco }}
        </ng-template>
        <ng-template matTabContent>
          <lp-led-overview-tab></lp-led-overview-tab>
        </ng-template>
      </mat-tab>

      @if (tabsDisplayConfig.courses) {
        <mat-tab id="courses">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2">rocket_launch</mat-icon>
            {{ 'LEADER_PANEL.LED_OVERVIEW.COURSES' | transloco }}
          </ng-template>
          <ng-template matTabContent>
            <lp-led-courses-tab></lp-led-courses-tab>
          </ng-template>
        </mat-tab>
      }

      @if (tabsDisplayConfig.trails) {
        <mat-tab id="trails">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2">route</mat-icon>
            {{ 'LEADER_PANEL.LED_OVERVIEW.TRAILS' | transloco }}
          </ng-template>
          <ng-template matTabContent>
            <lp-led-trails-tab></lp-led-trails-tab>
          </ng-template>
        </mat-tab>
      }

      @if (tabsDisplayConfig.pulses) {
        <mat-tab id="pulses">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2">track_changes</mat-icon>
            {{ 'LEADER_PANEL.LED_OVERVIEW.PULSES' | transloco }}
          </ng-template>
          <ng-template matTabContent>
            <lp-led-pulse-tab></lp-led-pulse-tab>
          </ng-template>
        </mat-tab>
      }

      @if (tabsDisplayConfig.channels) {
        <mat-tab id="channels">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2">hub</mat-icon>
            {{ 'LEADER_PANEL.LED_OVERVIEW.CHANNELS' | transloco }}
          </ng-template>
          <
          <ng-template matTabContent>
            <lp-led-channel-tab></lp-led-channel-tab>
          </ng-template>
        </mat-tab>
      }

      @if (tabsDisplayConfig.events) {
        <mat-tab id="events">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2">event</mat-icon>
            {{ 'LEADER_PANEL.LED_OVERVIEW.EVENTS' | transloco }}
          </ng-template>
          <ng-template matTabContent>
            <lp-led-event-tab></lp-led-event-tab>
          </ng-template>
        </mat-tab>
      }
    </mat-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedOverviewComponent implements OnDestroy {
  protected readonly defaultUserAvatar = constants.defaultUserAvatar;
  readonly selectedUser: Signal<Led>;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected readonly tabsDisplayConfig: Record<LedOverViewTabs, boolean>,
    private readonly store: Store,
  ) {
    this.selectedUser = toSignal(this.store.select(ledOverviewFeature.selectSelectedUser));
  }

  ngOnDestroy() {
    this.store.dispatch(LedOverviewActions.resetState());
  }
}
