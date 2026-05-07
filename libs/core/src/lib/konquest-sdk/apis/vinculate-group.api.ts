import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';

const URL = '/groups';

@Injectable({
  providedIn: 'root',
})
export class VinculateGroupApi {
  constructor(private _http: KonquestClient) {}

  vinculateCourse(groupId: string, contentId: string) {
    return this._http.post(`${URL}/${groupId}/missions`, { missions: [contentId] });
  }

  vinculateLearningTrail(groupId: string, contentId: string) {
    return this._http.post(`${URL}/${groupId}/learning-trails`, { learning_trails: [contentId] });
  }

  vinculateChannel(groupId: string, contentId: string) {
    return this._http.post(`${URL}/${groupId}/channels`, [contentId]);
  }
}
