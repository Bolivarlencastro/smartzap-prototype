import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { LearnContentType } from '@core/model';
import { CoursesService, LessonsService } from '../../services';
import { initialState } from '../reducers/lessons.reducer';
import { LessonsActions } from '../actions';
import { LessonsEffects } from './lessons.effects';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

class LessonsServiceMock {
  create(_id: string, _data: ContentFormData): Observable<any> {
    return of({});
  }

  edit(_data: { id: string; name: string; description: string }): Observable<any> {
    return of({});
  }

  createContent(_lessonId: string, _data: ContentFormData, _messagesContentEmbed: boolean): Observable<any> {
    return of({});
  }

  fetchLessonContents(_lessonId: string): Observable<any> {
    return of({});
  }

  editContent(_id: string, _data: any): Observable<any> {
    return of({});
  }
}

describe('LessonsEffects', () => {
  let actions$: Observable<Action>;
  let effects: LessonsEffects;
  let lessonsService: LessonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LessonsEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: LessonsService,
          useClass: LessonsServiceMock,
        },
        {
          provide: CoursesService,
          useValue: {},
        },
        {
          provide: KpMessageService,
          useValue: {},
        },
      ],
    });
    effects = TestBed.inject(LessonsEffects);
    lessonsService = TestBed.inject(LessonsService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('createLesson$', () => {
    it('should fire action when create lesson succeeds', (done) => {
      const courseId = 'course-id';
      const lessonName = 'lesson name';
      const lessonOrder = 1;
      actions$ = of(
        LessonsActions.createLesson({
          course: courseId,
          name: lessonName,
          order: lessonOrder,
        }),
      );
      jest.spyOn(lessonsService, 'create');

      effects.createLesson$.subscribe((action) => {
        expect(lessonsService.create).toHaveBeenCalledWith({
          course: courseId,
          name: lessonName,
          order: lessonOrder,
        });
        expect(action.type).toEqual(LessonsActions.createLessonSuccess.type);
        done();
      });
    });

    it('should fire failure action when could not create lesson with custom error message', (done) => {
      const courseId = 'course-id';
      const lessonName = 'lesson name';
      const lessonOrder = 1;
      const createLessonError = {
        status: 422,
        i18n: 'NAME.LONGER THAN MAXIMUM LENGTH 100.',
      };
      const expectedErrorMessage = `COURSE.FORM.ERROR.BY_FIELD.${createLessonError.i18n}`;
      actions$ = of(
        LessonsActions.createLesson({
          course: courseId,
          name: lessonName,
          order: lessonOrder,
        }),
      );
      jest.spyOn(lessonsService, 'create').mockReturnValue(throwError(createLessonError));

      effects.createLesson$.subscribe((action: any) => {
        expect(action.error).toEqual(expectedErrorMessage);
        expect(action.type).toEqual(LessonsActions.createLessonFailure.type);
        done();
      });
    });

    it('should fire failure action when could not create lesson with default error message', (done) => {
      const courseId = 'course-id';
      const lessonName = 'lesson name';
      const lessonOrder = 1;
      const createLessonError = { status: 422, error: '{}' };
      const defaultErrorMessage = 'COURSE.MESSAGE.LESSON_CREATE_ERROR';
      actions$ = of(
        LessonsActions.createLesson({
          course: courseId,
          name: lessonName,
          order: lessonOrder,
        }),
      );
      jest.spyOn(lessonsService, 'create').mockReturnValue(throwError(createLessonError));

      effects.createLesson$.subscribe((action: any) => {
        expect(action.error).toEqual(defaultErrorMessage);
        expect(action.type).toEqual(LessonsActions.createLessonFailure.type);
        done();
      });
    });
  });

  describe('editLesson$', () => {
    it('should fire action when edit lesson succeeds', (done) => {
      const payload = {
        id: 'id',
        data: { name: 'name', description: 'description' },
      };
      actions$ = of(LessonsActions.editLesson(payload));
      jest.spyOn(lessonsService, 'edit');

      effects.editLesson$.subscribe((action) => {
        expect(lessonsService.edit).toHaveBeenCalledWith({
          ...payload.data,
          id: payload.id,
        });
        expect(action.type).toEqual(LessonsActions.editLessonSuccess.type);
        done();
      });
    });

    it('should fire failure action when could not edit lesson with custom error message', (done) => {
      const payload = {
        id: 'id',
        data: { name: 'name', description: 'description' },
      };
      const editLessonError = {
        status: 422,
        i18n: 'NAME.LONGER THAN MAXIMUM LENGTH 100.',
      };
      const expectedErrorMessage = `COURSE.FORM.ERROR.BY_FIELD.${editLessonError.i18n}`;
      actions$ = of(LessonsActions.editLesson(payload));
      jest.spyOn(lessonsService, 'edit').mockReturnValue(throwError(editLessonError));

      effects.editLesson$.subscribe((action: any) => {
        expect(action.error).toEqual(expectedErrorMessage);
        expect(action.type).toEqual(LessonsActions.editLessonFailure.type);
        done();
      });
    });

    it('should fire failure action when could not edit lesson with default error message', (done) => {
      const payload = {
        id: 'id',
        data: { name: 'name', description: 'description' },
      };
      const editLessonError = { status: 422, error: '{}' };
      const defaultErrorMessage = 'COURSE.MESSAGE.LESSON_EDIT_ERROR';
      actions$ = of(LessonsActions.editLesson(payload));
      jest.spyOn(lessonsService, 'edit').mockReturnValue(throwError(editLessonError));

      effects.editLesson$.subscribe((action: any) => {
        expect(action.error).toEqual(defaultErrorMessage);
        expect(action.type).toEqual(LessonsActions.editLessonFailure.type);
        done();
      });
    });
  });

  describe('createContent$', () => {
    it('should fire action when create content succeeds', (done) => {
      const payload = {
        lesson_id: 'id',
        contentFormData: {
          type: 'LINK' as LearnContentType,
          name: 'name',
          value: 'value',
          description: 'description',
        },
        messagesContentEmbed: true,
      };
      actions$ = of(LessonsActions.createContent(payload));
      jest.spyOn(lessonsService, 'createContent');
      jest.spyOn(lessonsService, 'fetchLessonContents');

      effects.createContent$.subscribe((action) => {
        expect(lessonsService.createContent).toHaveBeenCalledWith(
          payload.lesson_id,
          payload.contentFormData,
          payload.messagesContentEmbed,
        );
        expect(lessonsService.fetchLessonContents).toHaveBeenCalledWith(payload.lesson_id);
        expect(action.type).toEqual(LessonsActions.updateLessonContents.type);
        done();
      });
    });

    it('should fire failure action when could not create content with custom error message', (done) => {
      const payload = {
        lesson_id: 'id',
        contentFormData: {
          type: 'LINK' as LearnContentType,
          name: 'name',
          value: 'value',
          description: 'description',
        },
        messagesContentEmbed: false,
      };
      const createContentError = {
        status: 422,
        i18n: 'NAME.LONGER THAN MAXIMUM LENGTH 100.',
      };
      const expectedErrorMessage = `COURSE.FORM.ERROR.BY_FIELD.${createContentError.i18n}`;
      actions$ = of(LessonsActions.createContent(payload));
      jest.spyOn(lessonsService, 'createContent').mockReturnValue(throwError(createContentError));

      effects.createContent$.subscribe((action: any) => {
        expect(action.error).toEqual(expectedErrorMessage);
        expect(action.type).toEqual(LessonsActions.createContentFailure.type);
        done();
      });
    });

    it('should fire failure action when could not create content with default error message', (done) => {
      const payload = {
        lesson_id: 'id',
        contentFormData: {
          type: 'LINK' as LearnContentType,
          name: 'name',
          value: 'value',
          description: 'description',
        },
        messagesContentEmbed: false,
      };
      const createContentError = { status: 422, error: '{}' };
      const expectedErrorMessage = `COURSE.MESSAGE.LESSON_CONTENT_CREATE_ERROR`;
      actions$ = of(LessonsActions.createContent(payload));
      jest.spyOn(lessonsService, 'createContent').mockReturnValue(throwError(createContentError));

      effects.createContent$.subscribe((action: any) => {
        expect(action.error).toEqual(expectedErrorMessage);
        expect(action.type).toEqual(LessonsActions.createContentFailure.type);
        done();
      });
    });
  });

  describe('editContent$', () => {
    it('should fire action when edit content succeeds', (done) => {
      const payload = {
        lesson_id: 'id',
        content_id: 'id',
        data: {
          name: 'name',
          description: 'description',
        },
      };
      actions$ = of(LessonsActions.editContent(payload));
      jest.spyOn(lessonsService, 'editContent');

      effects.editContent$.subscribe((action) => {
        expect(lessonsService.editContent).toHaveBeenCalledWith(payload.content_id, payload.data);
        expect(action.type).toEqual(LessonsActions.updateLessonContents.type);
        done();
      });
    });

    it('should fire failure action when could not edit content with custom error message', (done) => {
      const payload = {
        lesson_id: 'id',
        content_id: 'id',
        data: {
          name: 'name',
          description: 'description',
        },
      };
      const editContentError = {
        status: 422,
        i18n: 'NAME.LONGER THAN MAXIMUM LENGTH 100.',
      };
      const expectedErrorMessage = `COURSE.FORM.ERROR.BY_FIELD.${editContentError.i18n}`;
      actions$ = of(LessonsActions.editContent(payload));
      jest.spyOn(lessonsService, 'editContent').mockReturnValue(throwError(editContentError));

      effects.editContent$.subscribe((action: any) => {
        expect(action.error).toEqual(expectedErrorMessage);
        expect(action.type).toEqual(LessonsActions.editContentFailure.type);
        done();
      });
    });

    it('should fire failure action when could not edit content with default error message', (done) => {
      const payload = {
        lesson_id: 'id',
        content_id: 'id',
        data: {
          name: 'name',
          description: 'description',
        },
      };
      const editContentError = { status: 422, error: '{}' };
      const defaultErrorMessage = 'COURSE.MESSAGE.LESSON_CONTENT_EDIT_ERROR';
      actions$ = of(LessonsActions.editContent(payload));
      jest.spyOn(lessonsService, 'editContent').mockReturnValue(throwError(editContentError));

      effects.editContent$.subscribe((action: any) => {
        expect(action.error).toEqual(defaultErrorMessage);
        expect(action.type).toEqual(LessonsActions.editContentFailure.type);
        done();
      });
    });
  });
});
