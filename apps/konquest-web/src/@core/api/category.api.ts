import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api';
import { Category } from '@core/model/category.model';
import { Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';

const BASE_PATH = '/categories';

@Injectable({ providedIn: 'root' })
export class CategoryAPI {
  constructor(private _http: KonquestAPI) {}

  fetchOne(id: string): Observable<Category> {
    return this._http.get<Category>(`${BASE_PATH}/${id}`);
  }

  fetchByQuery(queryParams?: Record<string, unknown>): Observable<Pagination<Category>> {
    return this._http.get<Pagination<Category>>(`${BASE_PATH}`, queryParams);
  }

  create(data: any): Observable<Category> {
    return this._http.post<Category>(BASE_PATH, data);
  }

  update(id: string, data: any): Observable<Category> {
    return this._http.put(`${BASE_PATH}/${id}`, data);
  }

  deleteOne(id: string): Observable<any> {
    return this._http.delete(`${BASE_PATH}/${id}`);
  }
}
