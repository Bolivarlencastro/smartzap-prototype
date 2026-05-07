import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { QuestionRequest } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as PulseFeedQuizActions from '../../store/pulse-feed-quiz/pulse-feed-quiz.actions';
import { PulseFeedQuizComponent } from './pulse-feed-quiz.component';

const mockDialogRef = { close: jest.fn() };

describe('PulseFeedQuizComponent', () => {
  let component: PulseFeedQuizComponent;
  let fixture: ComponentFixture<PulseFeedQuizComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PulseFeedQuizComponent],
      providers: [
        provideMockStore({
          initialState: {
            pulseFeedQuiz: {
              quizId: null,
              pulseName: null,
              pulseDescription: null,
              questionIds: [],
              questionsCache: {},
              randomizeQuestions: false,
              randomizeOptions: false,
              loading: true,
              loadingAnswer: false,
              loadingScore: false,
              score: null,
              error: '',
            },
          },
        }),
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseFeedQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAnswer', () => {
    it('should dispatch saveAnswer action with the provided answer', () => {
      const answer: QuestionRequest = { id: 'q1', options: ['opt-1'] };

      component.onAnswer(answer);

      expect(store.dispatch).toHaveBeenCalledWith(PulseFeedQuizActions.saveAnswer({ answer }));
    });
  });

  describe('onFinish', () => {
    it('should dispatch pulseFeedQuizReset action', () => {
      component.onFinish();

      expect(store.dispatch).toHaveBeenCalledWith(PulseFeedQuizActions.pulseFeedQuizReset());
    });

    it('should close the dialog', () => {
      component.onFinish();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch pulseFeedQuizReset action', () => {
      component.ngOnDestroy();

      expect(store.dispatch).toHaveBeenCalledWith(PulseFeedQuizActions.pulseFeedQuizReset());
    });
  });
});
