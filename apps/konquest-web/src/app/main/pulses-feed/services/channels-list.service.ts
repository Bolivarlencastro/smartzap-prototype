import { inject, Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api/base';
import { SearchAPI } from '@core/api/base/search.api';
import { PageResponse } from '@core/model/search-api';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChannelSubscriptionResponse } from '../models/channel';
import { ChannelsListParams } from '../models/params';

@Injectable()
export class ChannelsListService {
  private readonly basePath = '/v1/channels';
  private readonly searchApi = inject(SearchAPI);
  private readonly konquestApi = inject(KonquestAPI);
  private readonly authService = inject(AuthService);

  loadChannelsList(params: ChannelsListParams): Observable<PageResponse<KpChannelCardModel>> {
    const { active, ...rest } = params;
    const finalParams = params.managed ? rest : params;
    return this.searchApi.get(this.basePath, finalParams);
  }

  toggleSubscription(channelId: string, subscriptionId: string | null): Observable<{ subscriptionId: string | null }> {
    if (subscriptionId) {
      return this.konquestApi
        .delete<void>(`/channels/subscriptions/${subscriptionId}`)
        .pipe(map(() => ({ subscriptionId: null })));
    }
    return this.konquestApi
      .post<ChannelSubscriptionResponse>(`/channels/subscriptions`, {
        channel: channelId,
        user: this.authService.userId,
      })
      .pipe(map((res) => ({ subscriptionId: res.id ?? '' })));
  }
}
