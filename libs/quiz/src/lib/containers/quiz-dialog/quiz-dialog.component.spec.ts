import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { QuizDialogComponent } from './quiz-dialog.component';
import { QuizFormService } from '../../services/quiz-dialog/quiz-form.service';
import { QuestionBankService } from '../../services/question-bank/question-bank.service';
import { quizFeature } from '../../store/quiz/quiz.feature';
import { QuestionBankOutput } from '../../models/quiz';

const mockBankQuestion: QuestionBankOutput = {
  id: 'bank-q1',
  question: 'O que é Angular?',
  options: [
    { id: 'o1', option: 'Um framework', correct_answer: true },
    { id: 'o2', option: 'Uma biblioteca', correct_answer: false },
  ],
  tags: [],
  created_date: '2024-01-01',
};

describe('QuizDialogComponent', () => {
  let component: QuizDialogComponent;
  let fixture: ComponentFixture<QuizDialogComponent>;
  let dialogRef: jest.Mocked<MatDialogRef<QuizDialogComponent>>;
  let store: MockStore;
  let formService: QuizFormService;
  let questionBankService: jest.Mocked<QuestionBankService>;

  beforeEach(async () => {
    dialogRef = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<QuizDialogComponent>>;
    questionBankService = {
      open: jest.fn().mockReturnValue(of(undefined)),
    } as unknown as jest.Mocked<QuestionBankService>;

    const matDialogMock = {
      open: jest.fn().mockReturnValue({
        componentInstance: {},
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [QuizDialogComponent, getTranslocoTestingModule()],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: QuestionBankService, useValue: questionBankService },
        provideMockStore(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(quizFeature.selectCurrentQuiz, null);
    store.overrideSelector(quizFeature.selectIsEditing, false);
    store.overrideSelector(quizFeature.selectLoading, false);

    fixture = TestBed.createComponent(QuizDialogComponent);
    component = fixture.componentInstance;
    formService = fixture.debugElement.injector.get(QuizFormService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('title', () => {
    it('should use the create title key when not editing', () => {
      expect(component['title']()).toBe('QUIZ.QUIZ_DIALOG.TITLE_CREATE');
    });

    it('should use the edit title key when editing', () => {
      store.overrideSelector(quizFeature.selectIsEditing, true);
      store.refreshState();
      fixture.detectChanges();

      expect(component['title']()).toBe('QUIZ.QUIZ_DIALOG.TITLE_EDIT');
    });
  });

  describe('onCancel()', () => {
    it('should close the dialog when the close button is clicked', () => {
      fixture.nativeElement.querySelector('button[mat-icon-button]').click();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should close the dialog when the footer emits cancelled', () => {
      fixture.debugElement.query(By.css('qz-quiz-dialog-footer')).triggerEventHandler('cancelled', null);

      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('questions', () => {
    it('should start with an empty questions list', () => {
      expect(formService.questionCount()).toBe(0);
    });

    describe('onAddQuestion()', () => {
      it('should add a question to the list', () => {
        component['onAddQuestion']();

        expect(formService.questionCount()).toBe(1);
      });

      it('should add multiple questions', () => {
        component['onAddQuestion']();
        component['onAddQuestion']();

        expect(formService.questionCount()).toBe(2);
      });

      it('should add a question when the footer emits addQuestion', () => {
        fixture.debugElement.query(By.css('qz-quiz-dialog-footer')).triggerEventHandler('addQuestion', null);

        expect(formService.questionCount()).toBe(1);
      });
    });

    describe('onDeleteQuestion()', () => {
      it('should remove the question at the given index', () => {
        component['onAddQuestion']();
        component['onAddQuestion']();
        component['onDeleteQuestion'](0);

        expect(formService.questionCount()).toBe(1);
      });
    });

    describe('canDeleteQuestion', () => {
      it('should be false when editing with only 1 question', () => {
        store.overrideSelector(quizFeature.selectIsEditing, true);
        store.refreshState();
        component['onAddQuestion']();
        fixture.detectChanges();

        expect(component['canDeleteQuestion']()).toBe(false);
      });

      it('should be true when editing with 2 or more questions', () => {
        store.overrideSelector(quizFeature.selectIsEditing, true);
        store.refreshState();
        component['onAddQuestion']();
        component['onAddQuestion']();
        fixture.detectChanges();

        expect(component['canDeleteQuestion']()).toBe(true);
      });
    });
  });

  describe('isPublishDisabled', () => {
    it('should be true when the questions list is empty', () => {
      expect(component['isPublishDisabled']()).toBe(true);
    });

    it('should be true when name is empty but questions exist', () => {
      component['onAddQuestion']();

      expect(component['isPublishDisabled']()).toBe(true);
    });
  });

  describe('onPublish()', () => {
    it('should not dispatch when the form is invalid', () => {
      fixture.debugElement.query(By.css('qz-quiz-dialog-footer')).triggerEventHandler('published', null);

      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('onQuestionBankClicked()', () => {
    it('should call QuestionBankService.open() when the footer emits questionBankClicked', () => {
      fixture.debugElement.query(By.css('qz-quiz-dialog-footer')).triggerEventHandler('questionBankClicked', null);

      expect(questionBankService.open).toHaveBeenCalled();
    });

    it('should not add questions when the dialog returns undefined', () => {
      questionBankService.open.mockReturnValue(of(undefined));

      component['onQuestionBankClicked']();

      expect(formService.questionCount()).toBe(0);
    });

    it('should not add questions when the dialog returns an empty array', () => {
      questionBankService.open.mockReturnValue(of([]));

      component['onQuestionBankClicked']();

      expect(formService.questionCount()).toBe(0);
    });

    it('should add questions from the bank as independent copies when the dialog returns questions', () => {
      questionBankService.open.mockReturnValue(of([mockBankQuestion]));

      component['onQuestionBankClicked']();

      expect(formService.questionCount()).toBe(1);
    });

    it('should map question text and options correctly from the bank', () => {
      questionBankService.open.mockReturnValue(of([mockBankQuestion]));

      component['onQuestionBankClicked']();

      const quiz = formService.getQuiz();
      const added = quiz.questions[0];
      expect(added.question_text).toBe(mockBankQuestion.question);
      expect(added.options).toEqual([
        { option: 'Um framework', correct_answer: true },
        { option: 'Uma biblioteca', correct_answer: false },
      ]);
    });

    it('should add multiple questions when multiple are selected', () => {
      const second: QuestionBankOutput = { ...mockBankQuestion, id: 'bank-q2', question: 'Segunda questão' };
      questionBankService.open.mockReturnValue(of([mockBankQuestion, second]));

      component['onQuestionBankClicked']();

      expect(formService.questionCount()).toBe(2);
    });
  });
});
