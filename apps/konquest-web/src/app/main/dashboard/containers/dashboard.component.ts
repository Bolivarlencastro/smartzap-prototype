import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardCardSectionComponent,
  DashboardChannelSectionComponent,
  DashboardPulseSectionComponent,
} from '../components';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { DashboardActions, dashboardFeature } from '../store';
import { Observable } from 'rxjs';
import { DashboardViewModel } from 'app/main/dashboard/models';
import { LearnContentActions } from 'app/shared/store';
import { KpBannerV2Component } from '@keeps-platform-frontend-workspace/ui/kp-banner-v2';
import { LearnContentActionData } from '@keeps-platform-frontend-workspace/ui/models';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { KpUserOnboardingService } from '@keeps-platform-frontend-workspace/ui/kp-user-onboarding-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    DashboardCardSectionComponent,
    TranslocoModule,
    KpBannerV2Component,
    DashboardPulseSectionComponent,
    DashboardChannelSectionComponent,
  ],
  template: `
    @if (vm$ | async; as vm) {
      <div class="pb-6">
        @if (vm.missionsActive) {
          <kp-banner-v2
            [items]="vm.priorityMission"
            (bannerAction)="onLearnContentAction($event)"
            [contentType]="'mission'"
          ></kp-banner-v2>
          @if (vm.missionEnrollments.length > 0) {
            <kp-dashboard-card-section
              [sectionTitle]="'DASHBOARD.HEADER.CONTINUE_MISSION_ENROLLMENTS' | transloco"
              [actionButtonLink]="['/enrollments/missions']"
              [contentType]="'mission'"
              [cardsData]="vm.missionEnrollments"
              [loading]="vm.loadingMissionEnrollments"
              (cardAction)="onLearnContentAction($event)"
            ></kp-dashboard-card-section>
          }
          @if (vm.missionRecommendations.length > 0) {
            <kp-dashboard-card-section
              [sectionTitle]="'DASHBOARD.HEADER.RECOMMENDED_MISSIONS' | transloco"
              [actionButtonLink]="['/missions']"
              [contentType]="'mission'"
              [cardsData]="vm.missionRecommendations"
              [loading]="vm.loadingMissionRecommendations"
              (cardAction)="onLearnContentAction($event)"
            ></kp-dashboard-card-section>
          }
        }
        @if (vm.trailsActive && vm.trailRecommendations.length > 0) {
          <kp-dashboard-card-section
            [sectionTitle]="'DASHBOARD.HEADER.RECOMMENDED_TRAILS' | transloco"
            [actionButtonLink]="['/learning-trails']"
            [contentType]="'trail'"
            [cardsData]="vm.trailRecommendations"
            [loading]="vm.loadingTrailRecommendations"
            [cardOrientation]="'landscape'"
            (cardAction)="onLearnContentAction($event)"
          ></kp-dashboard-card-section>
        }
        @if (vm.eventsActive && vm.events.length > 0) {
          <kp-dashboard-card-section
            [sectionTitle]="'DASHBOARD.HEADER.UPCOMING_EVENTS' | transloco"
            [actionButtonLink]="['/events']"
            [cardsData]="vm.events"
            [loading]="vm.loadingEvents"
            [contentType]="'mission'"
            (cardAction)="onLearnContentAction($event)"
          ></kp-dashboard-card-section>
        }
        @if (vm.pulsesActive && vm.pulses.length > 0) {
          <kp-dashboard-pulse-section
            [sectionTitle]="'DASHBOARD.HEADER.RECOMMENDED_PULSES' | transloco"
            [actionButtonLink]="['/pulse']"
            [cardsData]="vm.pulses"
            [loading]="vm.loadingPulses"
            (cardClick)="toPulse($event)"
            (bookmarkChange)="onPulseBookmark($event)"
          ></kp-dashboard-pulse-section>
          @if (vm.channels.length > 0) {
            <kp-dashboard-channel-section
              [sectionTitle]="'DASHBOARD.HEADER.RECOMMENDED_CHANNELS' | transloco"
              [actionButtonLink]="['/pulse']"
              [cardsData]="vm.channels"
              [loading]="vm.loadingChannel"
              (cardClick)="toChannel($event)"
              (subscribeChange)="onSubscribe($event)"
            ></kp-dashboard-channel-section>
          }
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected vm$: Observable<DashboardViewModel>;

  constructor(
    private store: Store,
    private userOnboardingService: KpUserOnboardingService,
  ) {
    this.store.dispatch(DashboardActions.loadDashboard());
    this.vm$ = this.store.select(dashboardFeature.selectViewModel);
  }

  ngOnInit() {
    this.userOnboardingService.openDialog('dashboard');
  }

  onLearnContentAction(learnContentAction: LearnContentActionData) {
    this.store.dispatch(LearnContentActions.learnContentAction({ learnContentAction }));
  }

  toPulse({ id, pulse_type }: PulseCardDto) {
    this.store.dispatch(DashboardActions.goToPulse({ id, pulse_type }));
  }

  onPulseBookmark(pulse: PulseCardDto): void {
    if (pulse.bookmark_id) {
      this.store.dispatch(DashboardActions.removePulseBookMark({ pulse }));
      return;
    }
    this.store.dispatch(DashboardActions.addPulseBookMark({ pulse }));
  }

  toChannel({ id }) {
    this.store.dispatch(DashboardActions.goToChannel({ id }));
  }

  onSubscribe(channel: KpChannelCardModel): void {
    if (channel?.subscription_id) {
      this.store.dispatch(DashboardActions.unsubscribeFromChannel({ channel }));
      return;
    }

    this.store.dispatch(DashboardActions.subscribeToChannel({ channel }));
  }
}
