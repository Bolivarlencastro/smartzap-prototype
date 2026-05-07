import { Injectable } from '@angular/core';
import { Category } from '@app/main/courses/model';
import { SmartzapAPI } from '@core/api';
import { map, Observable } from 'rxjs';
import { CollectionApiResponse } from '../model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private readonly http: SmartzapAPI) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<CollectionApiResponse<Category>>('/course-category', { per_page: '100', sort: 'name' })
      .pipe(map(({ result }) => result));
  }
}
