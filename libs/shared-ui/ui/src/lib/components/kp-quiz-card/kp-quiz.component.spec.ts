import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionRequest, QuizScoreOutput } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BehaviorSubject, Subject } from 'rxjs';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpQuizCardComponent } from './kp-quiz.component';
import { KpQuizCardService, QuizAnswerEntry } from './kp-quiz.service';
import { QuizCardContentItem } from './model';
import { KpQuizQuestionComponent } from './question/kp-quiz-question.component';
import { KpQuizSummaryComponent } from './summary/kp-quiz-summary.component';

describe('KpQuizCardComponent', () => {
  let component: KpQuizCardComponent;
  let fixture: ComponentFixture<KpQuizCardComponent>;
  let mockService: jest.Mocked<KpQuizCardService>;
  let selected$: BehaviorSubject<boolean>;
  let answered$: BehaviorSubject<boolean>;
  let nextContent$: Subject<void>;
  let goBack$: Subject<void>;

  const mockCmpRef = { instance: {}, destroy: jest.fn() };

  beforeEach(async () => {
    selected$ = new BehaviorSubject(false);
    answered$ = new BehaviorSubject(false);
    nextContent$ = new Subject<void>();
    goBack$ = new Subject<void>();

    mockService = {
      selected$: selected$.asObservable(),
      answered$: answered$.asObservable(),
      nextContent$: nextContent$.asObservable(),
      goBack$: goBack$.asObservable(),
      setScore: jest.fn(),
      setLoadingScore: jest.fn(),
      setShowNextContent: jest.fn(),
      setAnswers: jest.fn(),
      disableSelection: jest.fn(),
      getCurrentSelection: jest.fn().mockReturnValue(null),
      answered: jest.fn(),
    } as unknown as jest.Mocked<KpQuizCardService>;

    await TestBed.configureTestingModule({
      imports: [KpQuizCardComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    TestBed.overrideComponent(KpQuizCardComponent, {
      set: { providers: [{ provide: KpQuizCardService, useValue: mockService }] },
    });

    fixture = TestBed.createComponent(KpQuizCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('orderWarnKey', () => {
    it('should return ORDER_WARN when both randomize flags are on', () => {
      fixture.componentRef.setInput('randomizeQuestions', true);
      fixture.componentRef.setInput('randomizeOptions', true);

      expect(component.orderWarnKey).toBe('UI.QUIZ.ORDER_WARN');
    });

    it('should return ORDER_WARN_QUESTIONS when only randomizeQuestions is on', () => {
      fixture.componentRef.setInput('randomizeQuestions', true);
      fixture.componentRef.setInput('randomizeOptions', false);

      expect(component.orderWarnKey).toBe('UI.QUIZ.ORDER_WARN_QUESTIONS');
    });

    it('should return ORDER_WARN_OPTIONS when only randomizeOptions is on', () => {
      fixture.componentRef.setInput('randomizeQuestions', false);
      fixture.componentRef.setInput('randomizeOptions', true);

      expect(component.orderWarnKey).toBe('UI.QUIZ.ORDER_WARN_OPTIONS');
    });

    it('should return null when both flags are off', () => {
      fixture.componentRef.setInput('randomizeQuestions', false);
      fixture.componentRef.setInput('randomizeOptions', false);

      expect(component.orderWarnKey).toBeNull();
    });
  });

  describe('next', () => {
    beforeEach(() => {
      component.items = [
        new QuizCardContentItem(KpQuizQuestionComponent, { question: { id: 'q1' } }),
        new QuizCardContentItem(KpQuizQuestionComponent, { question: { id: 'q2' } }),
        new QuizCardContentItem(KpQuizSummaryComponent, {}),
      ];
      jest.spyOn(component.questionHost.viewContainerRef, 'createComponent').mockReturnValue(mockCmpRef as never);
      jest.spyOn(component.questionHost.viewContainerRef, 'clear').mockImplementation(() => {});
      component.currentIndex = 0;
    });

    it('should increment currentIndex', () => {
      component.next();

      expect(component.currentIndex).toBe(1);
    });

    it('should call disableSelection on the service', () => {
      component.next();

      expect(mockService.disableSelection).toHaveBeenCalled();
    });
  });

  describe('prev', () => {
    beforeEach(() => {
      component.items = [
        new QuizCardContentItem(KpQuizQuestionComponent, { question: { id: 'q1' } }),
        new QuizCardContentItem(KpQuizQuestionComponent, { question: { id: 'q2' } }),
        new QuizCardContentItem(KpQuizSummaryComponent, {}),
      ];
      jest.spyOn(component.questionHost.viewContainerRef, 'createComponent').mockReturnValue(mockCmpRef as never);
      jest.spyOn(component.questionHost.viewContainerRef, 'clear').mockImplementation(() => {});
    });

    it('should decrement currentIndex when it is greater than 0', () => {
      component.currentIndex = 1;

      component.prev();

      expect(component.currentIndex).toBe(0);
    });

    it('should not change currentIndex when it is already 0', () => {
      component.currentIndex = 0;

      component.prev();

      expect(component.currentIndex).toBe(0);
    });
  });

  describe('onAnswerer', () => {
    it('should emit answerEvent with the current selection', () => {
      const selection: QuestionRequest = { id: 'q1', options: ['opt-1'] };
      mockService.getCurrentSelection.mockReturnValue(selection);
      jest.spyOn(component.answerEvent, 'emit');

      component.onAnswerer();

      expect(component.answerEvent.emit).toHaveBeenCalledWith(selection);
    });

    it('should not emit answerEvent when there is no selection', () => {
      mockService.getCurrentSelection.mockReturnValue(null);
      jest.spyOn(component.answerEvent, 'emit');

      component.onAnswerer();

      expect(component.answerEvent.emit).not.toHaveBeenCalled();
    });
  });

  describe('effects', () => {
    it('should call setScore when the score input changes', () => {
      const score = { quiz_awarded_score: 5, quiz_available_score: 10 } as QuizScoreOutput;

      fixture.componentRef.setInput('score', score);
      fixture.detectChanges();

      expect(mockService.setScore).toHaveBeenLastCalledWith(score);
    });

    it('should call setLoadingScore when the loadingScore input changes', () => {
      fixture.componentRef.setInput('loadingScore', true);
      fixture.detectChanges();

      expect(mockService.setLoadingScore).toHaveBeenLastCalledWith(true);
    });

    it('should call setShowNextContent when the showNextContent input changes', () => {
      fixture.componentRef.setInput('showNextContent', false);
      fixture.detectChanges();

      expect(mockService.setShowNextContent).toHaveBeenLastCalledWith(false);
    });

    it('should call setAnswers when answers input is non-empty', () => {
      const answers: QuizAnswerEntry[] = [{ exam_has_question: 'q1', options: [], correct_options: [], is_ok: true }];

      fixture.componentRef.setInput('answers', answers);
      fixture.detectChanges();

      expect(mockService.setAnswers).toHaveBeenCalledWith(answers);
    });

    it('should not call setAnswers when answers input is empty', () => {
      mockService.setAnswers.mockClear();

      fixture.componentRef.setInput('answers', []);
      fixture.detectChanges();

      expect(mockService.setAnswers).not.toHaveBeenCalled();
    });
  });

  describe('goBack$ subscription', () => {
    it('should navigate to the second-to-last item when goBack$ emits', () => {
      component.items = [
        new QuizCardContentItem(KpQuizQuestionComponent, { question: { id: 'q1' } }),
        new QuizCardContentItem(KpQuizQuestionComponent, { question: { id: 'q2' } }),
        new QuizCardContentItem(KpQuizSummaryComponent, {}),
      ];
      const spy = jest.spyOn(component, 'loadQuestionComponent').mockImplementation(() => {});

      goBack$.next();

      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should not navigate when items has fewer than 2 entries', () => {
      component.items = [new QuizCardContentItem(KpQuizSummaryComponent, {})];
      const spy = jest.spyOn(component, 'loadQuestionComponent').mockImplementation(() => {});

      goBack$.next();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
