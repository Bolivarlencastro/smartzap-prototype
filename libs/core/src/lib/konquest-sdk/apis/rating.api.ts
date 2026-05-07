import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services';
import { KonquestClient } from './konquest.client';

@Injectable({ providedIn: 'root' })
export class RatingService {
  constructor(
    private _http: KonquestClient,
    private _authService: AuthService,
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
