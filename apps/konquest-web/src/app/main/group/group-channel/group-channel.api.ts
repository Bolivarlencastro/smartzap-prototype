import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KonquestAPI } from '@core/api';

const URL = '/groups';

@Injectable()
export class GroupChannelAPI {
  constructor(private _http: KonquestAPI) {}

  fetchByQuery(id: string, queryParams?: any): Observable<any> {
    return this._http.get(`${URL}/${id}/channels`, {
      ...queryParams,
    });
  }

  addMany(id: string, channelIds: string[]): Observable<any> {
    return this._http.post(`${URL}/${id}/channels`, channelIds);
  }

  delete(groupId: string, channelId: string): Observable<any> {
    return this._http.delete(`${URL}/${groupId}/channels/${channelId}`);
  }
}
