import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Channel,
  ChannelComment,
  ChannelCommentsFilters,
  ChannelPulse,
  ChannelPulsesFilters,
  ChannelSubscription,
  ChannelSubscriptionsFilters,
  ChannelType,
} from './channel.model';
import { KonquestAPI } from '@core/api';
import { Pulse, PulseRequest } from '@core/model/pulse.model';
import { Pagination } from '@core/model';

@Injectable({ providedIn: 'root' })
export class ChannelAPI {
  private basePath = '/channels';

  constructor(private _http: KonquestAPI) {}

  fetchChannels(params?: Record<string, unknown>): Observable<Pagination<Channel>> {
    return this._http.get<Pagination<Channel>>(this.basePath, params);
  }

  getChannel(id: string): Observable<Channel> {
    return this._http.get<Channel>(`${this.basePath}/${id}`);
  }

  deleteChannel(id: string): Observable<void> {
    return this._http.delete<void>(`${this.basePath}/${id}`);
  }

  putChannel(id: string, body: Channel): Observable<Channel> {
    return this._http.put<Channel>(`${this.basePath}/${id}`, body);
  }

  postChannel(body: Channel): Observable<Channel> {
    return this._http.post<Channel>(`${this.basePath}`, body);
  }

  postPulseQuiz(body: PulseRequest | undefined, id: string): Observable<Pulse> {
    return this._http.post<Pulse>(`${this.basePath}/${id}/pulses/exams`, body);
  }

  postChannelComment(body: ChannelComment): Observable<ChannelComment> {
    return this._http.post<ChannelComment>(`${this.basePath}/comments`, body);
  }

  putChannelComment(id: string, body: ChannelComment): Observable<ChannelComment> {
    return this._http.put<ChannelComment>(`${this.basePath}/comments/${id}`, body);
  }

  deleteChannelComment(id: string): Observable<any> {
    return this._http.delete<any>(`${this.basePath}/comments/${id}`);
  }

  getChannelComments(filters: ChannelCommentsFilters, page?: string): Observable<Pagination<ChannelComment>> {
    const { channel_id, ...others } = filters;
    return this._http.get<Pagination<ChannelComment>>(page || `${this.basePath}/${channel_id}/comments`, others);
  }

  getChannelPulses(filters: ChannelPulsesFilters, page?: string): Observable<Pagination<ChannelPulse>> {
    const { channel_id, ...others } = filters;
    return this._http.get<Pagination<ChannelPulse>>(page || `${this.basePath}/${channel_id}/pulses`, others);
  }

  getChannelSubscriptions(filters: ChannelSubscriptionsFilters): Observable<Pagination<ChannelSubscription>> {
    return this._http.get<Pagination<ChannelSubscription>>(`${this.basePath}/subscriptions`, filters);
  }

  postChannelSubscriptions(body: ChannelSubscription): Observable<ChannelSubscription> {
    return this._http.post<ChannelSubscription>(`${this.basePath}/subscriptions`, body);
  }

  deleteChannelSubscriptions(id: string): Observable<any> {
    return this._http.delete<any>(`${this.basePath}/subscriptions/${id}`);
  }

  getChannelTypes(): Observable<Pagination<ChannelType>> {
    return this._http.get<Pagination<ChannelType>>(`${this.basePath}/types`);
  }

  getSubscribers(id: string): Observable<any> {
    return this._http.get(`/channels/${id}/subscriptions`);
  }

  updateChannelDescription(id: string, description: string): Observable<Channel> {
    return this._http.patch<Channel>(`${this.basePath}/${id}`, { description });
  }
}
