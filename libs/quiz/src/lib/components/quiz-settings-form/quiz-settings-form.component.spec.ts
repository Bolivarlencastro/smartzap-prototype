import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { QuizSettingsFormComponent } from './quiz-settings-form.component';
import { QuizFormService } from '../../services/quiz-dialog/quiz-form.service';
import { getTranslocoTestingModule } from '../../transloco-testing.module';

describe('QuizSettingsFormComponent', () => {
  let fixture: ComponentFixture<QuizSettingsFormComponent>;
  let formService: QuizFormService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizSettingsFormComponent, getTranslocoTestingModule()],
      providers: [QuizFormService, { provide: MatDialog, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    formService = TestBed.inject(QuizFormService);
    fixture = TestBed.createComponent(QuizSettingsFormComponent);
    fixture.componentRef.setInput('quizForm', formService.quizForm);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the randomize questions toggle', () => {
    const toggle = fixture.nativeElement.querySelector('#randomizeQuestions');
    expect(toggle).not.toBeNull();
  });

  describe('when randomize_questions is disabled', () => {
    it('should not render the questions_to_show field', () => {
      const input = fixture.nativeElement.querySelector('#questionsToDisplay');
      expect(input).toBeNull();
    });
  });

  describe('when randomize_questions is enabled', () => {
    beforeEach(() => {
      formService.setQuiz({ ...formService.getQuiz(), randomize_questions: true });
      fixture.detectChanges();
    });

    it('should render the questions_to_show field', () => {
      const input = fixture.nativeElement.querySelector('#questionsToDisplay');
      expect(input).not.toBeNull();
    });

    it('should set the max attribute to the current question count', () => {
      formService.setQuiz({
        ...formService.getQuiz(),
        questions: [
          {
            question_text: 'Q1',
            options: [
              { option: 'A', correct_answer: true },
              { option: 'B', correct_answer: false },
            ],
          },
          {
            question_text: 'Q2',
            options: [
              { option: 'A', correct_answer: true },
              { option: 'B', correct_answer: false },
            ],
          },
        ],
      });
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('#questionsToDisplay');
      expect(input.max).toBe('2');
    });

    it('should hide the questions_to_show field when randomize is disabled again', () => {
      formService.setQuiz({ ...formService.getQuiz(), randomize_questions: false });
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('#questionsToDisplay');
      expect(input).toBeNull();
    });
  });
});
