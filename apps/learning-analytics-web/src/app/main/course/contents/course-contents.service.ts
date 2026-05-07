import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import {
  LazyResponse,
  CourseContentFilter,
  CourseContentListResponse,
  CourseDataResponse,
  CourseSource,
  LearnAnalyticsApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';

import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

const ERROR_NOT_FOUND = marker('COURSE.DETAILS.ERROR.NOT_FOUND');
const ERROR_UNKNOWN = marker('COURSE.DETAILS.ERROR.UNKNOWN');

const CATEGORIES = 'CATEGORY';

export type CONTENT_TYPE = { key: string; id: string; name: string };
export const CONTENT_TYPES: Record<string, CONTENT_TYPE> = {
  Blog: {
    key: 'Blog',
    id: 'e459d983-5c61-4e7d-8310-1eec2dc8f369',
    name: marker('GENERAL.CONTENT.BLOG'),
  },
  HTML: {
    key: 'HTML',
    id: 'bda0cca5-ac84-4257-8b83-defac7f96738',
    name: marker('GENERAL.CONTENT.HTML'),
  },
  'HTML File': {
    key: 'HTML File',
    id: 'ee9855a5-3a65-4dcb-81b9-ac9f16e01830',
    name: marker('GENERAL.CONTENT.HTML FILE'),
  },
  Image: {
    key: 'Image',
    id: '2284bfce-fdfc-4477-9143-39c380cc653c',
    name: marker('GENERAL.CONTENT.IMAGE'),
  },
  PDF: {
    key: 'PDF',
    id: '0faac34b-2393-4352-8a94-a9ee0659f824',
    name: marker('GENERAL.CONTENT.PDF'),
  },
  Podcast: {
    key: 'Podcast',
    id: '799f766c-a956-4c03-b5aa-bde9ba357de8',
    name: marker('GENERAL.CONTENT.PODCAST'),
  },
  Presentation: {
    key: 'Presentation',
    id: '7ee375e4-b781-46e6-b0de-0323ebb94b96',
    name: marker('GENERAL.CONTENT.PRESENTATION'),
  },
  Question: {
    key: 'Question',
    id: '7a41a8e0-ee37-4d0b-ad4f-35bada67134d',
    name: marker('GENERAL.CONTENT.QUESTION'),
  },
  SCORM: {
    key: 'SCORM',
    id: 'ee9855a5-3a65-4dcb-81b9-ac9f16e01831',
    name: marker('GENERAL.CONTENT.SCORM'),
  },
  Spreadsheet: {
    key: 'Spreadsheet',
    id: '673e4c02-ae1c-4e61-830b-706d35bd0b11',
    name: marker('GENERAL.CONTENT.SPREADSHEET'),
  },
  Text: {
    key: 'Text',
    id: 'b7094e27-b263-4fed-a928-6f0a78439cbe',
    name: marker('GENERAL.CONTENT.TEXT'),
  },
  Video: {
    key: 'Video',
    id: '569cc389-ac1d-4fa0-9692-f715b475b59b',
    name: marker('GENERAL.CONTENT.VIDEO'),
  },
};

@Injectable()
export class CourseContentsService {
  private _response = new BehaviorSubject<LazyResponse<CourseDataResponse>>({ response: {}, isLoading: false });
  private _courseData = new BehaviorSubject<CourseSource | null>(null);
  private _contentList = new BehaviorSubject<LazyResponse<CourseContentListResponse>>({
    response: { data: [], total: 0 },
    isLoading: false,
  });

  readonly response$ = this._response.asObservable();
  readonly courseData$ = this._courseData.asObservable();
  readonly contentList$ = this._contentList.asObservable();

  constructor(
    private translateService: TranslocoService,
    private _learnAnalyticsService: LearnAnalyticsApi,
  ) {}

  fetchCourseData(courseId: string): void {
    this._response.next({ ...this._response.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchCourseData(courseId)
      .pipe(
        map((response) => of(response)),
        switchMap((response) => forkJoin([response, this.handleCourseSource(response)])),
      )
      .subscribe({
        next: (responses) => this._response.next({ response: responses[0], isLoading: false }),
        error: (error) => {
          if (error.status === 404) {
            this._response.next({ response: {}, isLoading: false, error: ERROR_NOT_FOUND });
          } else {
            console.error(error);
            this._response.next({ response: {}, isLoading: false, error: ERROR_UNKNOWN });
          }
        },
      });
  }

  private handleCourseSource(response: Observable<CourseDataResponse>): Observable<CourseSource> {
    return response.pipe(
      filter((resp) => !!resp.data),
      map((resp) => (resp.data as CourseDataResponse)[0]._source),
      tap((source) => {
        const label = this.translateService.translate(`${CATEGORIES}.${source.course_category.name}`);
        source.course_category.name_translated = label.startsWith(CATEGORIES) ? source.course_category.name : label;
      }),
      tap((source) => this._courseData.next(source)),
    );
  }

  fetchCourseContents(courseId: string, filters: CourseContentFilter): void {
    this._contentList.next({ ...this._contentList.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchCourseContents(courseId, filters)
      .subscribe((response) => this._contentList.next({ response, isLoading: false }));
  }
}
