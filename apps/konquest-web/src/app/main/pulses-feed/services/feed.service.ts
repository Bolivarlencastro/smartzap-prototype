import { inject, Injectable } from '@angular/core';
import { SearchAPI } from '@core/api/base/search.api';
import { PulseAPI } from '@core/api/pulse.api';
import { PageResponse } from '@core/model/search-api';
import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { map, Observable } from 'rxjs';
import { ChannelPulseSideItem } from '../models/channel';
import { Pulse, PulseType } from '../models/pulse';

@Injectable()
export class FeedService {
  private readonly pulseApi = inject(PulseAPI);
  private readonly searchApi = inject(SearchAPI);

  loadChannelsFilterCreatedByMe(): Observable<ChannelPulseSideItem[]> {
    return this.searchApi
      .get<PageResponse<KpChannelCardModel>>('/v1/channels', { per_page: 999, managed: true })
      .pipe(map(({ items }) => (items ?? []).map(({ id, name, cover_image }) => ({ id, name, cover_image }))));
  }

  loadChannelsFilterSubscribed(): Observable<ChannelPulseSideItem[]> {
    return this.searchApi
      .get<PageResponse<KpChannelCardModel>>('/v1/channels', { per_page: 999, subscribed: true, active: true })
      .pipe(map(({ items }) => (items ?? []).map(({ id, name, cover_image }) => ({ id, name, cover_image }))));
  }

  loadPulseTypes(): Observable<PulseType[]> {
    return this.pulseApi
      .getPulsesTypes()
      .pipe(map(({ results }) => results.map(({ id, name }) => ({ id: id ?? '', name: name ?? '' }))));
  }

  loadFavoritePulses(): Observable<ChannelPulseSideItem[]> {
    return this.searchApi
      .get<PageResponse<Pulse>>('/v1/pulses', { per_page: 999, bookmarked: true })
      .pipe(map(({ items }) => (items ?? []).map(({ id, name, cover_image }) => ({ id, name, cover_image }))));
  }
}
