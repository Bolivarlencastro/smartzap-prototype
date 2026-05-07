import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LearningTrail } from '@app/main/learning-trail/model/learning-trail';
import { Mission, MissionCategory, MissionModel, MissionProvider } from '@app/main/mission/mission.model';
import { Pulse, PulseType } from '@core/model/pulse.model';
import { PulseService } from '@core/api';
import { SearchAPI } from '@core/api/base/search.api';
import { PageParams, PageResponse } from '@core/model/search-api';
import { DataType, GlobalSearchParams } from '@core/model/search-api/global-params.model';
import { GlobalSearchResponse } from '@core/model/search-api/global-response.model';
import {
  EnrollmentStatuses,
  KeepsUtils,
  UserProfileService,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { ENROLLMENT_STATUS_TAG_TYPE_MAP } from '@keeps-platform-frontend-workspace/ui/helpers';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { GlobalSearchItem, ItemType } from '@keeps-platform-frontend-workspace/ui/kp-global-search-item';
import { ContentTypeTab, ContentTypeTabs } from '@keeps-platform-frontend-workspace/ui/kp-global-search-list';
import {
  GlobalSearchFilterItem,
  GlobalSearchFilterOptions,
} from '@keeps-platform-frontend-workspace/ui/kp-global-search-side-filter';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { CardTagType } from '@keeps-platform-frontend-workspace/ui/models';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { map, Observable } from 'rxjs';
import { GlobalSearchComponent } from '../global-search.component';
import { GlobalSearchContentNavigate, ItemsResponse } from '../model/global-search.model';
import { environment } from 'environments/environment';
import { isEvent } from '@app/shared/utils/event.utils';
import { navigateToPulse as openPulseDetail } from 'app/shared/services/route-dialog.service';

export const enrollmentStatus = new Map<EnrollmentStatuses, string>([
  [EnrollmentStatuses.ENROLLED, marker('ENROLLMENT.STATUS.ENROLLED')],
  [EnrollmentStatuses.STARTED, marker('ENROLLMENT.STATUS.STARTED')],
  [EnrollmentStatuses.COMPLETED, marker('ENROLLMENT.STATUS.COMPLETED')],
  [EnrollmentStatuses.PENDING_VALIDATION, marker('ENROLLMENT.STATUS.PENDING_VALIDATION')],
  [EnrollmentStatuses.REFUSED, marker('ENROLLMENT.STATUS.REFUSED')],
  [EnrollmentStatuses.REPROVED, marker('ENROLLMENT.STATUS.REPROVED')],
  [EnrollmentStatuses.EXPIRED, marker('ENROLLMENT.STATUS.EXPIRED')],
  [EnrollmentStatuses.REQUEST_EXTENSION, marker('ENROLLMENT.STATUS.REQUEST_EXTENSION')],
  [EnrollmentStatuses.GIVE_UP, marker('ENROLLMENT.STATUS.GIVE_UP')],
  [EnrollmentStatuses.INACTIVATED, marker('ENROLLMENT.STATUS.INACTIVATED')],
]);

@Injectable()
export class GlobalSearchService {
  dialogRef: MatDialogRef<GlobalSearchComponent>;
  kpDurationPipe = new KpDurationPipe();
  kpPerformance = new KpPerformancePipe();
  datePipe: DatePipe;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _searchApi: SearchAPI,
    private readonly _pulseService: PulseService,
    private readonly _router: Router,
    private readonly _userProfileService: UserProfileService,
    private readonly _workspaceService: WorkspaceService,
  ) {
    this.datePipe = new DatePipe(this._userProfileService.getUserLocale());
  }

  openDialog(): void {
    this.dialogRef = this._dialog.open(GlobalSearchComponent, {
      width: '75vw',
      maxWidth: '90vw',
      height: '85vh',
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getTabs(): ContentTypeTab[] {
    const services = this._workspaceService.getWorkspaceServices() || [];
    const { learning_trail, mission, event, pulse } = environment.apps.konquest.services;

    const tabs: ContentTypeTab[] = [{ title: marker('GLOBAL_SEARCH.ALL'), value: ContentTypeTabs.ALL }];

    const serviceMap = [
      {
        id: learning_trail.id,
        tabItems: [{ title: marker('GLOBAL_SEARCH.TRAILS'), value: ContentTypeTabs.TRAILS }],
      },
      {
        id: mission.id,
        tabItems: [{ title: marker('GLOBAL_SEARCH.COURSES'), value: ContentTypeTabs.MISSIONS }],
      },
      {
        id: event.id,
        tabItems: [{ title: marker('GLOBAL_SEARCH.EVENTS'), value: ContentTypeTabs.EVENTS }],
      },
      {
        id: pulse.id,
        tabItems: [
          { title: marker('GLOBAL_SEARCH.CHANNELS'), value: ContentTypeTabs.CHANNELS },
          { title: marker('GLOBAL_SEARCH.PULSES'), value: ContentTypeTabs.PULSES },
        ],
      },
    ];

    serviceMap.forEach(({ id, tabItems }) => {
      if (services.some((service) => service.id === id)) {
        tabs.push(...tabItems);
      }
    });

    return tabs;
  }

  getFilterOptions(categories: MissionCategory[], providers: MissionProvider[]): GlobalSearchFilterOptions {
    return {
      enrollmentFilters: [
        {
          label: marker('GLOBAL_SEARCH.ENROLLMENT_STATUS'),
          value: 'enrollmentStatus',
          icon: 'circle',
          multipleSelection: true,
          options: Array.from(enrollmentStatus).map(([value, label]) => ({ value, label })),
        },
        {
          label: marker('GLOBAL_SEARCH.ENROLLMENT_TYPE'),
          value: 'enrollmentType',
          icon: 'notifications',
          options: [
            { label: marker('GLOBAL_SEARCH.FREE'), value: 'free' },
            { label: marker('GLOBAL_SEARCH.MANDATORY'), value: 'mandatory' },
          ],
        },
        {
          label: marker('GLOBAL_SEARCH.DUE_DATE'),
          value: 'duedate',
          icon: 'today',
          options: [
            { label: marker('GLOBAL_SEARCH.LATE'), value: 'late' },
            { label: marker('GLOBAL_SEARCH.IN_SEVEN_DAYS'), value: 'in_7_days' },
            { label: marker('GLOBAL_SEARCH.IN_THIRTY_DAYS'), value: 'in_30_days' },
          ],
        },
      ],
      courseFilters: [
        {
          label: marker('GLOBAL_SEARCH.CATEGORIES'),
          value: 'categories',
          icon: 'folder',
          multipleSelection: true,
          options: this.getMissionResponseOptions(categories),
        },
        {
          label: marker('GLOBAL_SEARCH.PROVIDERS'),
          value: 'platforms',
          icon: 'moving',
          multipleSelection: true,
          options: this.getMissionResponseOptions(providers),
        },
        {
          label: marker('GLOBAL_SEARCH.TIME'),
          value: 'duration',
          icon: 'schedule',
          options: [
            { label: marker('GLOBAL_SEARCH.SHORT'), value: 'short' },
            { label: marker('GLOBAL_SEARCH.MEDIUM'), value: 'medium' },
            { label: marker('GLOBAL_SEARCH.LONG'), value: 'long' },
          ],
        },
      ],
    };
  }

  getItems(contentType: ContentTypeTabs, params?: Record<string, unknown>): Observable<ItemsResponse> {
    return this.getContentTypeObservable(contentType, params).pipe(
      map((res) => {
        return {
          items: this.transformItems(res.items),
          count: res.total,
          next: res.page < res.last_page,
        } as ItemsResponse;
      }),
    );
  }

  openPulseDetails(id: string, pulse_type: PulseType): void {
    openPulseDetail(this._router, id);
  }

  navigateToContent(item: GlobalSearchContentNavigate): void {
    if (item.pulse_type) {
      this.navigateToPulse(item);
      return;
    }

    if (item.mission_model === MissionModel.EXTERNAL_PROVIDER) {
      this.navigateToExternalMission(item.external_url);
      return;
    }

    this.navigateToInternalMission(item.id);
  }

  findLastContentItem(trail: LearningTrail): GlobalSearchContentNavigate | undefined {
    for (const step of trail.steps) {
      if (
        this.isAvailableMission(step.mission) &&
        this.canOpenMission(step.mission.mission_model) &&
        this.isEnrolledInMission(step.mission.enrollment?.status)
      ) {
        return {
          id: step.mission.id,
          mission_model: step.mission.mission_model,
          external_url: step.mission.external_course_url,
        };
      }

      if (this.isPulseNotFinished(step.pulse)) {
        return { id: step.pulse.id, pulse_type: step.pulse.pulse_type };
      }
    }

    return undefined;
  }

  private navigateToPulse(item: GlobalSearchContentNavigate): void {
    openPulseDetail(this._router, item.id);
  }

  private navigateToExternalMission(url: string): void {
    KeepsUtils.openUrlInNewTab(url);
  }

  private navigateToInternalMission(id: string): void {
    this._router.navigate(['/course', id]);
  }

  private isAvailableMission(mission: Mission): boolean {
    return mission && mission.development_status === 'DONE';
  }

  private canOpenMission(missionModel: MissionModel): boolean {
    return missionModel !== 'LIVE' && missionModel !== 'PRESENTIAL';
  }

  private isEnrolledInMission(status: EnrollmentStatuses): boolean {
    return status === 'ENROLLED' || status === 'STARTED';
  }

  private isPulseNotFinished(pulse: Pulse): boolean {
    return pulse && Number(pulse.consume_time_in || 0) <= pulse.duration_time;
  }

  private getMissionResponseOptions(response: MissionCategory[] | MissionProvider[]): GlobalSearchFilterItem[] {
    return response.map((item: MissionCategory | MissionProvider) => ({
      label: item.name,
      value: item.id,
    }));
  }

  private getContentTypeObservable(contentType: ContentTypeTabs, params?: Record<string, unknown>) {
    const dataType = new Map<ContentTypeTabs, DataType>([
      [ContentTypeTabs.TRAILS, DataType.TRAILS],
      [ContentTypeTabs.MISSIONS, DataType.COURSES],
      [ContentTypeTabs.EVENTS, DataType.COURSES],
      [ContentTypeTabs.CHANNELS, DataType.CHANNELS],
      [ContentTypeTabs.PULSES, DataType.PULSES],
    ]);

    if (contentType === ContentTypeTabs.EVENTS) {
      params = { ...params, mission_model: ['LIVE', 'PRESENTIAL'] };
    }

    if (contentType === ContentTypeTabs.MISSIONS) {
      params = { ...params, mission_model: ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'] };
    }

    return this.fetchGlobalSearchResults({ ...params, dataType: dataType.get(contentType) });
  }

  private transformItems(items: GlobalSearchResponse[]): GlobalSearchItem[] {
    return items.map((item) => {
      switch (item.stats.dataType) {
        case DataType.COURSES:
          return this.transformEnrollableItems(item);
        case DataType.TRAILS:
          return this.transformEnrollableItems(item);
        case DataType.CHANNELS:
          return { ...item, type: ItemType.CHANNEL };
        case DataType.PULSES:
          return this.transformPulseItems(item);
        default:
          throw new Error('Invalid Content Type.');
      }
    });
  }

  private transformEnrollableItems(item: GlobalSearchResponse): GlobalSearchItem {
    const type = this.getEnrollableItemType(item.stats.dataType, item.course_model);
    const status = item.stats['user_enrollment']?.status;
    const required = item.stats['user_enrollment']?.required;

    item.enrollment_status = status;
    item.enrollment_required = required;
    item.tags = this.getEnrollmentTags(status, required);

    return { ...item, type };
  }

  private transformPulseItems(item: GlobalSearchResponse): GlobalSearchItem {
    return {
      ...item,
      type: ItemType.PULSE,
    };
  }

  private getEnrollmentTags(status: EnrollmentStatuses, required: boolean): CardTagType[] {
    const tags: CardTagType[] = [];

    if (status) {
      tags.push(ENROLLMENT_STATUS_TAG_TYPE_MAP.get(status));
    }

    if (required) {
      tags.push('modifier-required');
    }

    return tags;
  }

  private fetchGlobalSearchResults(
    params: GlobalSearchParams & PageParams,
  ): Observable<PageResponse<GlobalSearchResponse>> {
    return this._searchApi.get<PageResponse<GlobalSearchResponse>>(`/v1/global`, { ...params }, true);
  }

  private getEnrollableItemType(dataType: DataType, courseModel: string): ItemType {
    if (dataType === DataType.TRAILS) {
      return ItemType.TRAIL;
    }

    if (isEvent(courseModel)) {
      return ItemType.EVENT;
    }

    return ItemType.COURSE;
  }
}
