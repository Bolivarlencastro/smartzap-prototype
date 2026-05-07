import { Injectable } from '@angular/core';
import {
  LearnContentListBaseFilter,
  LearnContentListFilter,
  LearnContentManagementType,
} from '../models/learn-content-list-filter';
import {
  ChannelsListParams,
  CoursesListParams,
  PageParams,
  PageResponse,
  TrailsListParams,
} from '@core/model/search-api';
import { MissionModel } from '../../mission/mission.model';
import { CourseSearchService } from '../../mission/services/courses-search.service';
import { TrailsSearchService } from '../../mission/services/trails-search.service';
import { LearnContentListItem } from '../models/learn-content-list-item';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChannelsSearchService } from '@core/api/channels-search.service';

@Injectable({
  providedIn: 'root',
})
export class ContentManagementService {
  constructor(
    private readonly courseSearchService: CourseSearchService,
    private readonly trailsSearchService: TrailsSearchService,
    private readonly channelsSearchService: ChannelsSearchService,
  ) {}

  loadLearnContent(
    filter: LearnContentListFilter,
    type: LearnContentManagementType,
    forceFilteringOnlyManaged: boolean,
  ) {
    const buildedFilter = { ...filter, ...(forceFilteringOnlyManaged && { managed: true }) };

    switch (type) {
      case 'courses':
        return this.fetchCourses(buildedFilter);
      case 'events':
        return this.fetchEvents(buildedFilter);
      case 'trails':
        return this.fetchTrails(buildedFilter);
      case 'channels':
        return this.fetchChannels(buildedFilter);
    }
  }

  private fetchCourses(
    filter: CoursesListParams & LearnContentListBaseFilter,
  ): Observable<PageResponse<LearnContentListItem>> {
    const courseModels: MissionModel[] = [MissionModel.INTERNAL, MissionModel.SCORM, MissionModel.EXTERNAL_PROVIDER];
    const params: CoursesListParams & PageParams = {
      ...filter,
      mission_model: courseModels,
    };

    return this.courseSearchService
      .fetchMissions(params)
      .pipe(
        map((result) => ({ ...result, items: result.items.map((item) => LearnContentListItem.fromCourseItem(item)) })),
      );
  }

  private fetchEvents(
    filter: CoursesListParams & LearnContentListBaseFilter,
  ): Observable<PageResponse<LearnContentListItem>> {
    const eventModels = [MissionModel.PRESENTIAL, MissionModel.LIVE];
    const mission_model = filter.mission_model ?? eventModels;

    const params: CoursesListParams & PageParams = {
      ...filter,
      mission_model,
    };

    return this.courseSearchService
      .fetchMissions(params)
      .pipe(
        map((result) => ({ ...result, items: result.items.map((item) => LearnContentListItem.fromEventItem(item)) })),
      );
  }

  private fetchTrails(
    filter: TrailsListParams & LearnContentListBaseFilter,
  ): Observable<PageResponse<LearnContentListItem>> {
    return this.trailsSearchService
      .fetchTrails(filter)
      .pipe(
        map((result) => ({ ...result, items: result.items.map((item) => LearnContentListItem.fromTrailItem(item)) })),
      );
  }

  private fetchChannels(
    filter: ChannelsListParams & LearnContentListBaseFilter,
  ): Observable<PageResponse<LearnContentListItem>> {
    return this.channelsSearchService
      .fetchChannels(filter)
      .pipe(map((result) => ({ ...result, items: result.items.map((c) => LearnContentListItem.fromChannelItem(c)) })));
  }
}
