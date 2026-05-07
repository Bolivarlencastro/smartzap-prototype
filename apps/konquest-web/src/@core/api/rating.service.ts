import { Injectable } from '@angular/core';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { KonquestAPI } from './base';

@Injectable({ providedIn: 'root' })
export class RatingService {
  constructor(
    private _http: KonquestAPI,
    private _authService: AuthService,
    private _messageService: KpMessageService,
  ) {}

  ratePulse(data: any): Observable<{ rating_avg: number; rating_count: number }> {
    const user = this._authService.userId;
    return this._http
      .post<any>(`/pulses/ratings`, { ...data, user })
      .pipe(map(({ rating_avg, rating_count }) => ({ rating_avg, rating_count })));
  }

  rateMission(missionId: string | null, value: number | undefined): Observable<any> {
    const user = this._authService.userId;
    return this._http
      .post<any>(`/missions/ratings`, {
        rating: value,
        mission: missionId,
        user,
      })
      .pipe(
        switchMap(({ mission: id }) =>
          this._http.get<any>(`/missions/${id}`).pipe(map(({ rating_avg }) => rating_avg)),
        ),
        catchError((error) => {
          this._messageService.error('Ocorreu um erro ao tentar avaliar esta missão.');
          return error;
        }),
      );
  }

  loadMissionRatingByUser(missionId: string, user: string): Observable<any> {
    return this._http.get<any>(`/missions/${missionId}/ratings`, { user }).pipe(map((response) => response.results));
  }

  rateChannel(data: any): Observable<any> {
    const user = this._authService.userId;
    return this._http.post<any>(`/channels/ratings`, { ...data, user });
  }
}
