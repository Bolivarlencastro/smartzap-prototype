import { Injectable } from '@angular/core';
import { KontentClient } from './kontent.client';
import { LearnContent } from '../models';

@Injectable({ providedIn: 'root' })
export class KontentApi {
  constructor(private _http: KontentClient) {}

  fetchLearnContentById(contentId: string) {
    return this._http.get<LearnContent>(`/learn-content/${contentId}`);
  }
}
