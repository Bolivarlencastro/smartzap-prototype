import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchPageResponse, SearchClient } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Event } from '../models/events';
import { ListFilter } from '../models/list';
import { buildFilter } from '../utils/list-filter.util';

@Injectable({ providedIn: 'root' })
export class EventsLeaderApi {
  private readonly _http = inject(SearchClient);

  getEvents(filter: ListFilter): Observable<SearchPageResponse<Event>> {
    return this._http.get<SearchPageResponse<Event>>('/leaders/events', buildFilter(filter));
  }
}
