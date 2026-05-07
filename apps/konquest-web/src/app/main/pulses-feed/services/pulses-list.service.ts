import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { KonquestAPI } from '@core/api/base';
import { PulseAPI } from '@core/api/pulse.api';
import { PulseComment as CorePulseComment } from '@core/model/pulse.model';
import { SearchAPI } from '@core/api/base/search.api';
import { AuthService, KeepsPathLocationStrategy } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PULSES_DETAIL_PREFIX } from 'app/shared/services';
import { PulseComment } from '../models/pulse';
import { ChannelSubscriptionResponse } from '../models/channel';
import { PulseDetailsApiComment } from '../models/pulse-details';
import { PulsesListParams, PulsesListResponse } from '../models/params';

@Injectable({ providedIn: 'root' })
export class PulsesListService {
  private readonly basePath = '/v1/pulses';
  private readonly searchApi = inject(SearchAPI);
  private readonly pulseApi = inject(PulseAPI);
  private readonly konquestApi = inject(KonquestAPI);
  private readonly authService = inject(AuthService);
  private readonly document = inject(DOCUMENT);
  private readonly clipboard = inject(Clipboard);
  private readonly messageService = inject(KpMessageService);
  private readonly locationStrategy = inject(KeepsPathLocationStrategy);

  loadPulsesList(params: PulsesListParams): Observable<PulsesListResponse> {
    return this.searchApi.get<PulsesListResponse>(`${this.basePath}/feed`, params);
  }

  loadPulseComments(pulseId: string): Observable<PulseComment[]> {
    return this.pulseApi.getPulseComments({ pulse_id: pulseId, ordering: '-created_date' }).pipe(
      map((res) =>
        ((res.results ?? []) as unknown as PulseDetailsApiComment[]).map((c) => ({
          id: c.id,
          avatar: c.user.avatar,
          name: c.user.name,
          user_id: c.user.id,
          comment: c.comment,
          created_at: c.created_date,
        })),
      ),
    );
  }

  deleteComment(commentId: string): Observable<void> {
    return this.pulseApi.deletePulseComment(commentId);
  }

  editComment(commentId: string, pulseId: string, text: string): Observable<CorePulseComment> {
    return this.pulseApi.editPulseComment(commentId, {
      comment: text,
      pulse: pulseId,
      user: this.authService.userId,
    } as any);
  }

  toggleBookmark(pulseId: string, bookmarkId: string | null): Observable<{ bookmarkId: string | null }> {
    if (bookmarkId) {
      return this.pulseApi.deletePulseBookmark(bookmarkId).pipe(map(() => ({ bookmarkId: null })));
    }
    return this.pulseApi
      .postPulseBookmark({ pulse: pulseId, user: this.authService.userId })
      .pipe(map((res) => ({ bookmarkId: res.id ?? '' })));
  }

  toggleSubscription(
    channelId: string,
    channelSubscription: string | null,
  ): Observable<{ channelSubscription: string | null }> {
    if (channelSubscription) {
      return this.konquestApi
        .delete<void>(`/channels/subscriptions/${channelSubscription}`)
        .pipe(map(() => ({ channelSubscription: null })));
    }
    return this.konquestApi
      .post<ChannelSubscriptionResponse>(`/channels/subscriptions`, {
        channel: channelId,
        user: this.authService.userId,
      })
      .pipe(map((res) => ({ channelSubscription: res.id ?? '' })));
  }

  ratePulse(pulseId: string, rating: number): Observable<void> {
    return this.konquestApi.post<void>(`/pulses/ratings`, { pulse: pulseId, rating, user: this.authService.userId });
  }

  loadPulseAverageRating(pulseId: string): Observable<number> {
    return this.pulseApi.getPulse(pulseId).pipe(map((pulse) => pulse.rating_avg ?? 0));
  }

  submitComment(pulseId: string, text: string): Observable<CorePulseComment> {
    return this.pulseApi.postPulseComment({
      pulse: pulseId,
      comment: text,
      user: this.authService.userId,
    });
  }

  copyPulseLink(pulseId: string): void {
    const internalPath = `${PULSES_DETAIL_PREFIX}/${pulseId}`;
    const externalPath = this.locationStrategy.prepareExternalUrl(internalPath);
    this.clipboard.copy(`${this.document.location.origin}${externalPath}`);
    this.messageService.info('PULSES_FEED.PULSE_CARD.COPY_LINK_SUCCESS');
  }
}
