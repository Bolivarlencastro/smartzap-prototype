import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';
import { MissionProvider } from 'app/main/mission/mission.model';

@Injectable({ providedIn: 'root' })
export class ProvidersService {
  constructor(private readonly http: KonquestAPI) {}

  getProviders() {
    return this.http.get<Pagination<MissionProvider>>(`/missions/providers`);
  }
}
