import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchPageResponse, SearchClient } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Trail } from '../models/trail';
import { ListFilter } from '../models/list';
import { buildFilter } from '../utils/list-filter.util';

@Injectable({ providedIn: 'root' })
export class TrailsLeaderApi {
  private readonly _http = inject(SearchClient);

  getTrails(filter: ListFilter): Observable<SearchPageResponse<Trail>> {
    return this._http.get<SearchPageResponse<Trail>>('/leaders/trails', buildFilter(filter));
  }
}
