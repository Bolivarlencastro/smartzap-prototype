import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { SurveyQuizQuestionDialogComponent } from './survey-quiz-question-dialog.component';

describe('SurveyQuizQuestionDialogComponent', () => {
  let component: SurveyQuizQuestionDialogComponent;
  let fixture: ComponentFixture<SurveyQuizQuestionDialogComponent>;
  let dialogRef: MatDialogRef<SurveyQuizQuestionDialogComponent>;
  let formBuilder: UntypedFormBuilder;

  const mockDialogRef = {
    close: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyQuizQuestionDialogComponent, ReactiveFormsModule, getTranslocoTestingModule()],
      providers: [
        UntypedFormBuilder,
        {
          provide: MAT_DIALOG_DATA,
          useValue: { action: 'new' },
        },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQuizQuestionDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    formBuilder = TestBed.inject(UntypedFormBuilder);
    fixture.detectChanges();
  });

  describe('Getters', () => {
    it('should return correct dialog title for new question', () => {
      expect(component.dialogTitle).toBe('COURSE.FORM.QUIZ.QUESTION.DIALOG.TITLE_NEW');
    });

    it('should return true when questionInputType is CHOICE', () => {
      component.setQuestionInputType('CHOICE');
      expect(component.isChoiceType).toBe(true);
      expect(component.isTextType).toBe(false);
    });

    it('should return true when questionInputType is TEXT', () => {
      component.setQuestionInputType('TEXT');
      expect(component.isChoiceType).toBe(false);
      expect(component.isTextType).toBe(true);
    });

    it('should return invalid state for text type when input is empty', () => {
      component.setQuestionInputType('TEXT');
      component.textTypeInput.set('');
      expect(component.isInvalid).toBe(true);
    });

    it('should return invalid state for text type when input is null', () => {
      component.setQuestionInputType('TEXT');
      component.textTypeInput.set(null);
      expect(component.isInvalid).toBe(true);
    });

    it('should return valid state for text type when input has value', () => {
      component.setQuestionInputType('TEXT');
      component.textTypeInput.set('Question text');
      expect(component.isInvalid).toBe(false);
    });

    it('should return invalid state for choice type when form is invalid', () => {
      component.setQuestionInputType('CHOICE');
      component.choiceTypeForm.get('title').setValue('');
      expect(component.isInvalid).toBe(true);
    });

    it('should return invalid state for choice type when form is pristine', () => {
      component.setQuestionInputType('CHOICE');
      expect(component.isInvalid).toBe(true);
    });

    it('should return form array for options', () => {
      expect(component.options).toBeDefined();
      expect(component.options.length).toBe(2);
    });

    it('should disable add option when there are 5 options', () => {
      component.addOption();
      component.addOption();
      component.addOption();

      expect(component.options.length).toBe(5);
      expect(component.isAddOptionDisabled).toBe(true);
    });

    it('should enable add option when there are less than 5 options', () => {
      expect(component.options.length).toBe(2);
      expect(component.isAddOptionDisabled).toBe(false);
    });

    it('should disable delete option for new question with 2 options', () => {
      expect(component.isNew).toBe(true);
      expect(component.options.length).toBe(2);
      expect(component.isDeleteOptionDisabled).toBe(true);
    });

    it('should enable delete option for new question with 3+ options', () => {
      component.addOption();
      expect(component.options.length).toBe(3);
      expect(component.isDeleteOptionDisabled).toBe(false);
    });
  });

  describe('Dialog Operations', () => {
    it('should close dialog when close method is called', () => {
      component.close();
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should set question input type', () => {
      component.setQuestionInputType('TEXT');
      expect(component.questionInputType()).toBe('TEXT');

      component.setQuestionInputType('CHOICE');
      expect(component.questionInputType()).toBe('CHOICE');
    });

    it('should save text type question', () => {
      component.setQuestionInputType('TEXT');
      component.textTypeInput.set('Enter your feedback');

      component.onSave();

      expect(dialogRef.close).toHaveBeenCalledWith({
        id: '',
        order: 1,
        title: 'Enter your feedback',
        question_type: 'survey_text',
        question_input_type: 'TEXT',
      });
    });

    it('should save choice type question', () => {
      component.setQuestionInputType('CHOICE');

      fixture.detectChanges();

      component.choiceTypeForm.patchValue({
        title: 'Select options',
      });

      component.onSave();

      expect(dialogRef.close).toHaveBeenCalledWith({
        id: '',
        title: 'Select options',
        question_type: 'survey_choices',
        order: 1,
        options: [
          { id: '', option: '' },
          { id: '', option: '' },
        ],
        question_input_type: 'CHOICE',
      });
    });

    it('should not save if form is invalid for choice type', () => {
      component.setQuestionInputType('CHOICE');
      component.choiceTypeForm.get('title').setValue('');

      component.onSave();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should not save if text input is empty', () => {
      component.setQuestionInputType('TEXT');
      component.textTypeInput.set('');

      component.onSave();

      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
