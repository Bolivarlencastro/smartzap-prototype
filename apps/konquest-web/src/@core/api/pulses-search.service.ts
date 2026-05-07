import { Injectable } from '@angular/core';
import { SearchAPI } from '@core/api/base/search.api';
import { PageResponse, PulsesListParams } from '@core/model/search-api';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PulsesSearchService {
  private readonly basePath = '/v1/pulses';

  constructor(private searchApi: SearchAPI) {}

  fetchPulses(params: PulsesListParams): Observable<PageResponse<PulseCardDto>> {
    return this.searchApi.get(this.basePath, params);
  }

  fetchChannelPulses(channelId: string, params: PulsesListParams): Observable<PageResponse<PulseCardDto>> {
    return this.searchApi.get(`${this.basePath}/channel/${channelId}`, params);
  }
}
