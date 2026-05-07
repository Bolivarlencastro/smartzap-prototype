import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LessonsActions } from '@app/main/courses/store/actions';
import { initialState } from '@app/main/courses/store/reducers/course.reducer';
import { LearnContentType } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { CourseContentsComponent } from './course-contents.component';

describe('CourseContentsComponent', () => {
  let component: CourseContentsComponent;
  let fixture: ComponentFixture<CourseContentsComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [CourseContentsComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { ['course']: initialState } }), provideNoopAnimations()],
    });

    fixture = TestBed.createComponent(CourseContentsComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch createLesson action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [course, name, order] = ['course-1', 'Course 1', 1];
    component.onCreateLesson({ course, name, order });
    expect(spy).toHaveBeenCalledWith(LessonsActions.createLesson({ course, name, order }));
  });

  it('should dispatch deteleLesson action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onRemoveLesson('1');
    expect(spy).toHaveBeenCalledWith(LessonsActions.deteleLesson({ id: '1' }));
  });

  it('should dispatch editLesson action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [id, data] = ['1', { name: 'test', description: 'test' }];
    component.onEditLesson({ id, data });
    expect(spy).toHaveBeenCalledWith(LessonsActions.editLesson({ id, data }));
  });

  describe('createExam', () => {
    it('should dispatch createExam action when quiz type is EVALUATIVE_QUIZ', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const [lesson_id, contentFormData, messagesContentEmbed] = [
        '1',
        { type: 'EVALUATIVE_QUIZ' as LearnContentType, name: 'test', value: 1 },
        false,
      ];
      component.onCreateContent({ lesson_id, contentFormData, messagesContentEmbed });
      expect(spy).toHaveBeenCalledWith(
        LessonsActions.createExam({ lesson_id, data: { name: contentFormData.name, type: 'EVALUATIVE_QUIZ' } }),
      );
    });

    it('should dispatch createExam action when quiz type is SURVEY_QUIZ', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const [lesson_id, contentFormData, messagesContentEmbed] = [
        '1',
        { type: 'SURVEY_QUIZ' as LearnContentType, name: 'test', value: 1 },
        false,
      ];
      component.onCreateContent({ lesson_id, contentFormData, messagesContentEmbed });
      expect(spy).toHaveBeenCalledWith(
        LessonsActions.createExam({ lesson_id, data: { name: contentFormData.name, type: 'SURVEY_QUIZ' } }),
      );
    });
  });

  it('should dispatch createContent action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [lesson_id, contentFormData, messagesContentEmbed] = [
      '1',
      { type: 'LINK' as LearnContentType, name: 'test', value: 1 },
      true,
    ];
    component.onCreateContent({ lesson_id, contentFormData, messagesContentEmbed });
    expect(spy).toHaveBeenCalledWith(
      LessonsActions.createContent({ lesson_id, contentFormData, messagesContentEmbed }),
    );
  });

  it('should dispatch deleteContent action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [content_id, lesson_id] = ['1', '1'];
    component.onRemoveContent({ id: content_id, lesson_id });
    expect(spy).toHaveBeenCalledWith(LessonsActions.deleteContent({ lesson_id, content_id }));
  });

  it('should dispatch editContent action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [content_id, lesson_id, data] = ['1', '1', { name: 'test', description: 'test' }];
    component.onEditContent({ id: content_id, lesson_id, data });
    expect(spy).toHaveBeenCalledWith(LessonsActions.editContent({ content_id, lesson_id, data }));
  });

  it('should dispatch editDispatchPeriod action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [content_id, lesson_id, dispatch_period] = ['1', '1', '1'];
    component.onChangeContentPeriod({ content_id, lesson_id, dispatch_period });
    expect(spy).toHaveBeenCalledWith(LessonsActions.editDispatchPeriod({ content_id, lesson_id, dispatch_period }));
  });

  it('should dispatch editDispatchIn action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [content_id, lesson_id, dispatch_in] = ['1', '1', 1];
    component.onChangeContentDispatchIn({ content_id, lesson_id, dispatch_in });
    expect(spy).toHaveBeenCalledWith(LessonsActions.editDispatchIn({ content_id, lesson_id, dispatch_in }));
  });
});
