import { Injectable } from '@angular/core';
import { Language, LanguagesApiResponse } from '@app/main/courses/model';
import { SmartzapAPI } from '@core/api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguagesService {
  constructor(private readonly http: SmartzapAPI) {}

  getLanguages(): Observable<Language[]> {
    return this.http.get<LanguagesApiResponse>('/course/language', { sort: 'name' }).pipe(map(({ idioms }) => idioms));
  }
}
