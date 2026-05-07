import { Injectable } from '@angular/core';
import { ChannelCategory } from '@app/main/channel/channel.model';
import { MissionCategory } from '@app/main/mission/mission.model';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { forkJoin, map, Observable } from 'rxjs';

interface KonquestCategories {
  missionsFiltered: MissionCategory[];
  channels: ChannelCategory[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private _http: KonquestAPI) {}

  getCategories(): Observable<KonquestCategories> {
    return forkJoin({
      missionsFiltered: this.getCategoriesFromAPI<MissionCategory>('/missions/categories?only_has_mission=true'),
      channels: this.getCategoriesFromAPI<ChannelCategory>('/channels/categories'),
    });
  }

  private getCategoriesFromAPI<T>(path: string): Observable<T[]> {
    return this._http.get<Pagination<T>>(path).pipe(map((res) => res?.results ?? []));
  }

  getAllMissionCategories(): Observable<MissionCategory[]> {
    return this.getCategoriesFromAPI<MissionCategory>('/missions/categories');
  }
}
