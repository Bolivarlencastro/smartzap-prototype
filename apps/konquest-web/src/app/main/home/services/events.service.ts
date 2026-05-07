import { Injectable } from '@angular/core';
import { CourseSearchService } from '@app/main/mission/services/courses-search.service';
import { mapCoursesToLearnContentCard } from '@app/shared/utils/card-helpers';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { map, Observable } from 'rxjs';
import { EventsFilter } from '../models/events';

@Injectable()
export class EventsService {
  constructor(private readonly courseSearchService: CourseSearchService) {}

  loadEvents(
    filter: EventsFilter,
    isSuperAdmin: boolean,
    isAdmin: boolean,
  ): Observable<{ events: LearnContentCardData[]; finished: boolean }> {
    const builtFilter = this.buildFilter(filter);
    return this.courseSearchService.fetchMissions(builtFilter).pipe(
      map((response) => ({
        events: mapCoursesToLearnContentCard(response.items, isSuperAdmin, isAdmin),
        finished: response.page >= response.last_page,
      })),
    );
  }

  private buildFilter(filter: EventsFilter) {
    return {
      page: filter.page,
      per_page: filter.per_page,
      mission_model: ['LIVE', 'PRESENTIAL'],
    };
  }
}
