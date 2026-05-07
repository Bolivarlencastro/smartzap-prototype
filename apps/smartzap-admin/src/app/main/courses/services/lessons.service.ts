import { Injectable } from '@angular/core';
import { SmartzapAPI } from '@core/api/smartzap.api';
import { ExamService, LearnContentService } from '@core/services';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Content, EVALUATIVE_TYPE_ID, Lesson, SURVEY_TYPE_ID } from '../model';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';

const PATH = '/lesson';

@Injectable()
export class LessonsService {
  constructor(
    private _http: SmartzapAPI,
    private _learnContentService: LearnContentService,
    private _examService: ExamService,
  ) {}

  create({ course: course_id, name, order }: { course: string; name: string; order: number }): Observable<Lesson> {
    return this._http.post<Lesson>(PATH, {
      course_id,
      name,
      order,
    });
  }

  edit({ id, name, description }: Partial<Lesson>): Observable<void> {
    return this._http.patch<void>(`${PATH}/${id}`, { name, description });
  }

  delete({ id }: Partial<Lesson>): Observable<void> {
    return this._http.delete<void>(`${PATH}/${id}`);
  }

  createContent(lesson_id: string, contentFormData: ContentFormData, messagesContentEmbed: boolean): Observable<any> {
    const { name, description } = contentFormData;
    const order = 1;
    const dispatch_in = 1;
    const dispatch_period = 'MORNING';
    const fileType = (contentFormData as ContentFormData & { learnContentType?: string }).learnContentType;

    return this._learnContentService.createLearnContent(contentFormData, messagesContentEmbed).pipe(
      map((learnContent) => {
        const { id: learn_content, content_type } = learnContent;
        return {
          name,
          description: description || undefined,
          order,
          dispatch_in,
          lesson_id,
          learn_content,
          type_id: this.resolveContentTypeId(content_type, fileType),
          dispatch_period,
        };
      }),
      switchMap((body) => this._http.post<Content>('/content', body)),
    );
  }

  deleteContent(content_id: string): Observable<void> {
    return this._http.delete<void>(`/content/${content_id}`);
  }

  fetchLessonContents(lesson_id: string): Observable<Content[]> {
    return this._http
      .get<any>(`/lesson/${lesson_id}/content`, {
        per_page: 100,
        sort: 'order',
      })
      .pipe(map(({ result }) => result));
  }

  editContent(id: string, data: any): Observable<void> {
    const { name, description, learn_content, value, messagesContentEmbed = false, learnContentType } = data;
    const patchContent$ = this._http.patch<void>(`/content/${id}`, { name, description });

    if (learn_content && value) {
      return this._learnContentService
        .updateLearnContent(
          learn_content,
          {
            type: 'FILE',
            name,
            description,
            value,
            learnContentType,
          },
          messagesContentEmbed,
        )
        .pipe(switchMap(() => patchContent$));
    }

    return patchContent$;
  }

  updateContentDispatchIn(data: any): Observable<void> {
    const { content_id, dispatch_in } = data;
    return this._http.patch<void>(`/content/${content_id}`, { dispatch_in });
  }

  updateContentDispatchPeriod(data: any): Observable<void> {
    const { content_id, dispatch_period } = data;
    return this._http.patch<void>(`/content/${content_id}`, {
      dispatch_period,
    });
  }

  reorderContents(contents: Content[]): Observable<void[]> {
    return forkJoin(
      contents.map((content, index) => this._http.patch<void>(`/content/${content.id}`, { order: index + 1 })),
    );
  }

  createExam(lesson_id: string, data: any): Observable<any> {
    const { type, name, description } = data;
    const order = 1;
    const dispatch_in = 1;
    const dispatch_period = 'MORNING';
    const exam_type = type === 'EVALUATIVE_QUIZ' ? 'EVALUATIVE' : 'SURVEY';
    const type_id = type === 'EVALUATIVE_QUIZ' ? EVALUATIVE_TYPE_ID : SURVEY_TYPE_ID;

    return this._examService.createExam({ title: name, exam_type }).pipe(
      map((exam) => {
        const { id: learn_content } = exam;
        return {
          name,
          description: description || undefined,
          order,
          dispatch_in,
          lesson_id,
          learn_content,
          type_id,
          dispatch_period,
        };
      }),
      switchMap((body) => this._http.post<Content>('/content', body)),
    );
  }

  private resolveContentTypeId(contentType: string | undefined, fallbackType?: string): string {
    const resolvedType = (contentType || fallbackType || '').toUpperCase();

    if (resolvedType === 'VIDEO') return 'ct-video';
    if (resolvedType === 'IMAGE') return 'ct-image';
    if (resolvedType === 'PODCAST') return 'ct-podcast';
    if (resolvedType === 'PDF') return 'ct-pdf';

    return contentType || 'ct-pdf';
  }
}
