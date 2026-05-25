import { inject, Injectable } from '@angular/core';
import {
  CoursesFilterModel,
  CreateCampaignParamsModel,
  PushManagerApi,
  PushTemplate,
  SmartzapAdminAPI,
  ValidateCampaignParamsModel,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { map, Observable } from 'rxjs';

@Injectable()
export class CreationService {
  private readonly smartzapAdminApi = inject(SmartzapAdminAPI);
  private readonly pushManagerApi = inject(PushManagerApi);

  fetchTemplates(): Observable<PushTemplate[]> {
    return this.pushManagerApi.fetchTemplates().pipe(map((res) => res?.itens));
  }

  fetchCourses(filter: CoursesFilterModel) {
    return this.smartzapAdminApi.fetchCourses(filter).pipe(map((res) => res?.result));
  }

  validateCampaign(params: ValidateCampaignParamsModel) {
    return this.pushManagerApi.validateCampaign(params);
  }

  createCampaign(params: CreateCampaignParamsModel) {
    return this.pushManagerApi.createCampaign(params);
  }
}
