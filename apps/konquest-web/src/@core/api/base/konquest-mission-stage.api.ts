import { Injectable } from '@angular/core';
import { KonquestAPI } from './konquest.api';
import { Observable } from 'rxjs';

const PATH = '/missions/stages';

@Injectable({ providedIn: 'root' })
export class KonquestMissionStageAPI {
  constructor(protected http: KonquestAPI) {}

  createContent(data: any): Observable<any> {
    return this.http.post(`${PATH}/contents`, data);
  }
}
