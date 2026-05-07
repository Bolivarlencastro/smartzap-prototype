import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LearnContent } from '../model/learn-content.model';
import { KontentAPI } from './base';

@Injectable()
export class LearnContentAPI {
  private basePath = '/learn-content';
  public unsubscribeComponent$ = new Subject<void>();
  public unsubscribe$ = this.unsubscribeComponent$.asObservable();

  constructor(private _httpKontent: KontentAPI) {}

  getLearnContent(learnContentId: string): Observable<LearnContent> {
    return this._httpKontent.get(`${this.basePath}/${learnContentId}`);
  }
}
