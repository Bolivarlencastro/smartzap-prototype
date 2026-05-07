import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PulseAPI } from '@core/api/pulse.api';
import { LearnContent } from '@core/model';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { Pulse } from '@core/model/pulse.model';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { KonquestAPI } from './base';
import { LearnContentService } from './learn-content.service';
import { Router } from '@angular/router';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { navigateToPulse as openPulseDetail } from 'app/shared/services/route-dialog.service';

@Injectable({ providedIn: 'root' })
export class PulseService {
  private _QUIZ = '7a41a8e0-ee37-4d0b-ad4f-35bada67134d';
  private _url = '/pulses';

  private pathBase = '/pulses';

  constructor(
    private _http: KonquestAPI,
    private _pulseAPI: PulseAPI,
    private _learnContentService: LearnContentService,
    private _authService: AuthService,
    private _kpMessageService: KpMessageService,
    private _router: Router,
  ) {}

  createPulse(data: ContentFormData): Observable<any> {
    return this._learnContentService.createLearnContent(data).pipe(
      switchMap((response) => {
        if (response.type === HttpEventType.Response) {
          return this.savePulse({ ...response.body, description: data.description });
        }

        if (data.value instanceof File) {
          return of({ ...response, description: data.description });
        }

        return this.savePulse({ ...response, description: data.description });
      }),
    );
  }

  isQuiz(pulseTypeId: string): boolean {
    return this._QUIZ === pulseTypeId;
  }

  fetchPulseFavorite(params: any): Observable<any> {
    return this._pulseAPI.getPulseBookmark({
      ...params,
      user: this._authService.userId,
    });
  }

  removePulse(pulseId: string): Observable<void> {
    return this._pulseAPI.deletePulse(pulseId).pipe(
      tap({
        next: () => this._kpMessageService.success('QUIZ.CONTENT.REMOVE_QUIZ_SUCCESS'),
        error: () => this._kpMessageService.error('QUIZ.CONTENT.REMOVE_QUIZ_ERROR'),
      }),
    );
  }

  updatePulse(pulseId: string, data: any): Observable<any> {
    return this._http.patch(`${this.pathBase}/${pulseId}`, data);
  }

  // Private methods
  private savePulse(learnContent: LearnContent): Observable<Pulse> {
    const { name, description, id: learn_content_uuid, content_type: pulse_type } = learnContent;
    const user_creator = this._authService.userId;
    return this._http.post<Pulse>(this._url, {
      name,
      description,
      learn_content_uuid,
      pulse_type,
      user_creator,
    });
  }

  navigateToPulse(id: string, pulse_type: any) {
    if (pulse_type.id) {
      openPulseDetail(this._router, id);
    }
  }
}
