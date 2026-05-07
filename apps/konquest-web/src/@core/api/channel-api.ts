import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { KonquestAPI } from './base';

@Injectable({ providedIn: 'root' })
export class ChannelApi {
  private basePath = '/channels';

  constructor(private _http: KonquestAPI) {}

  transferChannel(channelId: string, newOwnerId: string): Observable<any> {
    return this._http.post(`${this.basePath}/${channelId}/change-user-creator`, { user_creator: newOwnerId });
  }
}
