import { Injectable } from '@angular/core';
import { LearnContentActivity } from '@core/model';
import { Observable } from 'rxjs';
import { KonquestAPI } from './konquest.api';

const PATH = '/users/learn-activities';

@Injectable({ providedIn: 'root' })
export class KonquestActivityApi {
  constructor(protected http: KonquestAPI) {}

  public create(activity: LearnContentActivity): Observable<LearnContentActivity> {
    return this.http.post<LearnContentActivity>(PATH, activity);
  }

  public update(id: string, activity: any): Observable<LearnContentActivity> {
    return this.http.patch<LearnContentActivity>(`${PATH}/${id}`, activity);
  }

  public get(id: string): Observable<LearnContentActivity> {
    return this.http.get<LearnContentActivity>(`${PATH}/${id}`);
  }
}
