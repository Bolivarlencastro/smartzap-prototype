import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassQuizComponent } from './quiz.component';
import { ClassroomFacade } from '../../facades';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../transloco-scope.factory';

describe('ClassQuizComponent', () => {
  let component: ClassQuizComponent;
  let fixture: ComponentFixture<ClassQuizComponent>;
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;

  beforeEach(async () => {
    classroomFacadeMock = {
      nextStep: jest.fn(),
      answerQuestion: jest.fn(),
      examAnswers$: of([]),
      examQuestions$: of([]),
      answeringQuiz$: of(false),
      examLoading$: of(false),
      examScore$: of(null),
      examLoadingScore$: of(false),
      examRandomizeQuestions$: of(false),
      examRandomizeOptions$: of(false),
      isViewingAsUser: signal(false),
    } as unknown as jest.Mocked<ClassroomFacade>;

    await TestBed.configureTestingModule({
      imports: [ClassQuizComponent, NoopAnimationsModule, getTranslocoTestingModule()],
      providers: [{ provide: ClassroomFacade, useValue: classroomFacadeMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call next on the facade when finishing a quiz', () => {
    component.onFinishExam();
    expect(classroomFacadeMock.nextStep).toHaveBeenCalled();
  });
});
