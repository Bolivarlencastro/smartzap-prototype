import { Injectable } from '@angular/core';
import { SearchAPI } from '@core/api/base/search.api';
import { CoursesListParams, CoursesResponse, PageParams, PageResponse } from '@core/model/search-api';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseSearchService {
  private basePath = '/v1/courses';

  constructor(private search: SearchAPI) {}

  fetchMissions(params: CoursesListParams & PageParams): Observable<PageResponse<CoursesResponse>> {
    return this.search.get<PageResponse<CoursesResponse>>(this.basePath, {
      ...params,
    });
  }
}
