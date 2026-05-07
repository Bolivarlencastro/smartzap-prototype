import { inject, Injectable } from '@angular/core';
import {
  CoursesFilterModel,
  PushManagerApi,
  PushTemplate,
  SmartzapAdminAPI,
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
}
