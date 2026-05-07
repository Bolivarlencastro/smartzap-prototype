import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SmartzapCourse, CoursesFilterModel, SmartzapPagination } from '../models';
import { SmartzapAdminClient } from './smartzap-admin.client';

@Injectable({
  providedIn: 'root',
})
export class SmartzapAdminAPI {
  constructor(private readonly _http: SmartzapAdminClient) {}

  fetchCourses(filter: CoursesFilterModel): Observable<SmartzapPagination<SmartzapCourse>> {
    return this._http.get('/course', filter);
  }
}
