import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { ChannelSubscription, ChannelSubscriptionResponse } from 'app/main/channel/channel.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PulseService } from './pulse.service';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  public static readonly KEY_CHANNEL_FILTER_CHANNEL_CATEGORIES = 'KEY_CHANNEL_FILTER_CHANNEL_CATEGORIES';

  public unsubscribeComponent$ = new Subject<void>();
  public unsubscribe$ = this.unsubscribeComponent$.asObservable();

  private _url = '/channels';

  constructor(
    private _http: KonquestAPI,
    private _pulseService: PulseService,
    private _authService: AuthService,
    private _messageService: KpMessageService,
  ) {}

  static getFilterChannelCategories(): string[] {
    const categoriesFromCache = localStorage.getItem(ChannelService.KEY_CHANNEL_FILTER_CHANNEL_CATEGORIES);

    if (!categoriesFromCache) {
      return [];
    }

    return JSON.parse(categoriesFromCache);
  }

  postChannelSubscription(channelId: string): Observable<ChannelSubscriptionResponse> {
    const userId = this._authService.userId;
    return this._http.post<ChannelSubscriptionResponse>(`${this._url}/subscriptions`, {
      channel: channelId,
      user: userId,
    });
  }

  deleteChannelSubscriptions(subscriptionId: string): Observable<Pagination<ChannelSubscription>> {
    return this._http.delete<Pagination<ChannelSubscription>>(`${this._url}/subscriptions/${subscriptionId}`);
  }

  createPulse(channelId: string, data: ContentFormData): Observable<any> {
    this._messageService.info(marker('PULSES.WAITING_CREATION'));
    return this._pulseService.createPulse(data).pipe(
      switchMap((pulseResponse) => {
        if (pulseResponse.learn_content_uuid) {
          return this.includePulseInChannel(channelId, pulseResponse.id).pipe(map(() => pulseResponse));
        } else {
          return of(pulseResponse);
        }
      }),
    );
  }

  private includePulseInChannel(channelId: string, pulseId: string): Observable<any> {
    return this._http.post<any>(`${this._url}/${channelId}/pulses`, {
      pulse_id: pulseId,
    });
  }
}
