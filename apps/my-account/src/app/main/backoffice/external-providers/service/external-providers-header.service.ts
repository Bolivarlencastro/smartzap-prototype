import { Injectable } from '@angular/core';
import { ProviderDto } from '../model/external-providers.dto';

import { CoursesApi } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({
  providedIn: 'root',
})
export class ExternalProvidersHeaderService {
  constructor(private missionApi: CoursesApi) {}

  newProviderApi(newDateProvider: ProviderDto) {
    return this.missionApi.newProvider(newDateProvider);
  }
}
