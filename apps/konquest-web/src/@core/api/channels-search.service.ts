import { Injectable } from '@angular/core';
import { SearchAPI } from '@core/api/base/search.api';
import { ChannelsListParams, ChannelsResponse, PageResponse } from '@core/model/search-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelsSearchService {
  private readonly basePath = '/v1/channels';

  constructor(private searchApi: SearchAPI) {}

  fetchChannels(params: ChannelsListParams): Observable<PageResponse<ChannelsResponse>> {
    return this.searchApi.get(this.basePath, params);
  }
}
