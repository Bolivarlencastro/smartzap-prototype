import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchPageResponse, SearchClient } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Course } from '../models/course';
import { ListFilter } from '../models/list';
import { buildFilter } from '../utils/list-filter.util';

@Injectable({ providedIn: 'root' })
export class CoursesLeaderApi {
  private readonly _http = inject(SearchClient);

  getCourses(filter: ListFilter): Observable<SearchPageResponse<Course>> {
    return this._http.get<SearchPageResponse<Course>>('/leaders/courses', buildFilter(filter));
  }
}
