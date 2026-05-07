import { Injectable } from '@angular/core';
import { SearchAPI } from '@core/api/base/search.api';
import { PageParams, PageResponse, TrailsListParams, TrailsResponse } from '@core/model/search-api';
import { TrailLearnContent } from 'app/main/learning-trail/model/learning-trail';

@Injectable({ providedIn: 'root' })
export class TrailsSearchService {
  private basePath = '/v1/trails';

  constructor(private searchApi: SearchAPI) {}

  fetchTrails(params: TrailsListParams & PageParams) {
    return this.searchApi.get<PageResponse<TrailsResponse>>(this.basePath, { ...params });
  }

  fetchTrailsContents(search: string) {
    return this.searchApi.get<PageResponse<TrailLearnContent>>(`/v1/trails-contents`, { search });
  }
}
