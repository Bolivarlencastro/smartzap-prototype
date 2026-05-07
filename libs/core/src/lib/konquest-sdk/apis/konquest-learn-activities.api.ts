import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';
import { LearnContentActivity } from '../models';

const PATH = '/users/learn-activities';

@Injectable({ providedIn: 'root' })
export class KonquestLearnActivitiesApi {
  constructor(private http: KonquestClient) {}

  public create(activity: LearnContentActivity) {
    return this.http.post<LearnContentActivity>(PATH, activity);
  }

  public update(id: string, activity: any) {
    return this.http.patch<LearnContentActivity>(`${PATH}/${id}`, activity);
  }

  public get(id: string) {
    return this.http.get<LearnContentActivity>(`${PATH}/${id}`);
  }
}
