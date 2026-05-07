import { Injectable } from '@angular/core';
import { Pagination } from '@core/model';
import { Observable } from 'rxjs';

import {
  Pulse,
  PulseBookmark,
  PulseComment,
  PulseCommentsFilters,
  PulsesBookmarksFilters,
  PulsesTypesFilters,
  PulseType,
} from '@core/model/pulse.model';
import { KonquestAPI } from './base';

@Injectable({ providedIn: 'root' })
export class PulseAPI {
  private basePath = '/pulses';

  constructor(private _http: KonquestAPI) {}

  getPulse(id: string): Observable<Pulse> {
    return this._http.get<Pulse>(`${this.basePath}/${id}`);
  }

  getPulsesTypes(filters?: PulsesTypesFilters): Observable<Pagination<PulseType>> {
    return this._http.get<Pagination<PulseType>>(`${this.basePath}/types`, filters);
  }

  getPulseRecommendations(filters: Record<string, unknown>): Observable<Pagination<Pulse>> {
    return this._http.get<Pagination<Pulse>>(`${this.basePath}/my-recommendations`, filters);
  }

  getPulseBookmark(filters: PulsesBookmarksFilters, page?: string): Observable<Pagination<PulseBookmark>> {
    return this._http.get<Pagination<PulseBookmark>>(page || `${this.basePath}/bookmarks`, filters);
  }

  postPulseBookmark(body: PulseBookmark | undefined): Observable<PulseBookmark> {
    return this._http.post<PulseBookmark>(`${this.basePath}/bookmarks`, body);
  }

  deletePulseBookmark(bookmarkId: string): Observable<PulseBookmark> {
    return this._http.delete<PulseBookmark>(`${this.basePath}/bookmarks/${bookmarkId}`);
  }

  postPulseComment(body: PulseComment): Observable<PulseComment> {
    return this._http.post<PulseComment>(`${this.basePath}/comments`, body);
  }

  deletePulseComment(commentId: string): Observable<any> {
    return this._http.delete<any>(`${this.basePath}/comments/${commentId}`);
  }

  editPulseComment(commentId: string, body: PulseComment): Observable<PulseComment> {
    return this._http.put<PulseComment>(`${this.basePath}/comments/${commentId}`, body);
  }

  editPulse(pulseId: string, body: any): Observable<Pulse> {
    return this._http.patch<Pulse>(`${this.basePath}/${pulseId}`, body);
  }

  deletePulse(pulseId: string): Observable<any> {
    return this._http.delete<any>(`${this.basePath}/${pulseId}`);
  }

  getPulseComments(filters: PulseCommentsFilters, page?: string): Observable<Pagination<PulseComment>> {
    const { pulse_id, ...others } = filters;
    return this._http.get<Pagination<PulseComment>>(page || `${this.basePath}/${pulse_id}/comments`, others);
  }

  updatePulseDescription(id: string, description: string): Observable<Pulse> {
    return this._http.patch<Pulse>(`${this.basePath}/${id}`, { description });
  }

  updatePulseContent(pulseId: string, contentId: string): Observable<Pulse> {
    return this._http.patch<Pulse>(`${this.basePath}/${pulseId}`, { learn_content_uuid: contentId });
  }
}
