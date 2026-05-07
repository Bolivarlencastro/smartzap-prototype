import { Injectable } from '@angular/core';
import { KonquestMissionAPI } from '@core/api/base/konquest-mission.api';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import {
  AuthService,
  DevelopmentStatus,
  EnrollmentStatuses,
  Pagination,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { map, tap } from 'rxjs/operators';
import {
  mapCoursesToLearnContentCard,
  mapMissionToLearnContentCard,
  mapPulsesToPulseCard,
  mapTrailsToLearnContentCard,
} from 'app/shared/utils/card-helpers';
import { CourseSearchService } from 'app/main/mission/services/courses-search.service';
import { MissionModel } from 'app/main/mission/mission.model';
import { ChannelsListParams, CoursesListParams, PageParams } from '@core/model/search-api';
import { PulseAPI } from '@core/api/pulse.api';
import { Router } from '@angular/router';
import { PulseBookmark } from '@core/model/pulse.model';
import { navigateToPulse as openPulseDetail } from 'app/shared/services/route-dialog.service';
import { Observable } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { ChannelsSearchService } from '@core/api/channels-search.service';
import { KonquestAPI } from '@core/api';
import { ChannelSubscription, ChannelSubscriptionResponse } from '@app/main/channel/channel.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private _QUIZ = '7a41a8e0-ee37-4d0b-ad4f-35bada67134d';
  private _url = '/channels';

  constructor(
    private missionsApi: KonquestMissionAPI,
    private trailsApi: LearningTrailAPI,
    private userProfileService: UserProfileService,
    private courseSearchService: CourseSearchService,
    private pulseApi: PulseAPI,
    private _router: Router,
    private _authService: AuthService,
    private messageService: KpMessageService,
    private channelApi: ChannelsSearchService,
    private konquestApi: KonquestAPI,
  ) {}

  fetchPriorityMission() {
    return this.missionsApi
      .fetchMissionsDashboardPriority()
      .pipe(map((mission) => mapMissionToLearnContentCard([mission], true)?.at(0)));
  }

  fetchMissionEnrollments() {
    const params = {
      development_status: DevelopmentStatus.DONE,
      is_active: true,
      enrolled: true,
      mission_model: [MissionModel.INTERNAL, MissionModel.EXTERNAL_PROVIDER, MissionModel.SCORM],
      exclude_enrollment_status: [
        EnrollmentStatuses.COMPLETED,
        EnrollmentStatuses.INACTIVATED,
        EnrollmentStatuses.EXPIRED,
        EnrollmentStatuses.GIVE_UP,
        EnrollmentStatuses.REPROVED,
        EnrollmentStatuses.PENDING_VALIDATION,
        EnrollmentStatuses.REFUSED,
        EnrollmentStatuses.REQUEST_EXTENSION,
      ],
      per_page: 5,
    };

    return this.courseSearchService.fetchMissions(params).pipe(map(({ items }) => mapCoursesToLearnContentCard(items)));
  }

  fetchMissionRecommendations() {
    const isSuperAdmin = this.userProfileService.isSuperAdmin();
    const isAdmin = this.userProfileService.isAdmin();

    return this.missionsApi
      .fetchMissionsRecommendations({
        page: 1,
        per_page: 5,
      })
      .pipe(map(({ results }) => mapMissionToLearnContentCard(results, false, isSuperAdmin, isAdmin)));
  }

  fetchTrailRecommendations() {
    const isSuperAdmin = this.userProfileService.isSuperAdmin();

    return this.trailsApi
      .getRecommendationsLearningTrails({
        page: 1,
        per_page: 3,
      })
      .pipe(map(({ results }) => mapTrailsToLearnContentCard(results, false, isSuperAdmin)));
  }

  fetchEvents() {
    const params: CoursesListParams & PageParams = {
      development_status: DevelopmentStatus.DONE,
      is_active: true,
      mission_model: [MissionModel.LIVE, MissionModel.PRESENTIAL],
      exclude_enrollment_status: [EnrollmentStatuses.EXPIRED],
      page: 1,
      per_page: 5,
    };

    return this.courseSearchService.fetchMissions(params).pipe(map(({ items }) => mapCoursesToLearnContentCard(items)));
  }

  fetchPulsesRecomendations() {
    return this.pulseApi
      .getPulseRecommendations({ page: 1, per_page: 5 })
      .pipe(map(({ results }) => mapPulsesToPulseCard(results)));
  }
  fetchChannels() {
    const params: ChannelsListParams = {
      active: true,
      page: 1,
      per_page: 3,
      managed: false,
    };
    return this.channelApi.fetchChannels(params).pipe(map(({ items }) => items));
  }

  isQuiz(pulseTypeId: string): boolean {
    return this._QUIZ === pulseTypeId;
  }

  navigateToPulse(id: string, pulse_type: any) {
    if (pulse_type.id) {
      openPulseDetail(this._router, id);
    }
  }

  navigateToChannel(id: any) {
    const route = ['/channels', 'details', id];
    this._router.navigate(route);
  }

  postPulseBookmark(pulseId: string): Observable<PulseBookmark> {
    const body = { pulse: pulseId, user: this._authService.userId };
    return this.pulseApi
      .postPulseBookmark(body)
      .pipe(tap(() => this.messageService.success('PULSES.BOOKMARK.SUCCESSFULLY_ADDED')));
  }

  deletePulseBookmark(bookmarkId: string) {
    return this.pulseApi
      .deletePulseBookmark(bookmarkId)
      .pipe(tap(() => this.messageService.success('PULSES.BOOKMARK.SUCCESSFULLY_REMOVED')));
  }

  deleteChannelSubscriptions(subscriptionId: string): Observable<Pagination<ChannelSubscription>> {
    return this.konquestApi.delete<Pagination<ChannelSubscription>>(`${this._url}/subscriptions/${subscriptionId}`);
  }

  postChannelSubscription(channelId: string): Observable<ChannelSubscriptionResponse> {
    const userId = this._authService.userId;
    return this.konquestApi.post<ChannelSubscriptionResponse>(`${this._url}/subscriptions`, {
      channel: channelId,
      user: userId,
    });
  }
}
