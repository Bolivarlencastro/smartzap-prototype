import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { QuizWizardDialogComponent } from './quiz-wizard-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

describe('QuizWizardDialogComponent', () => {
  let component: QuizWizardDialogComponent;
  let fixture: ComponentFixture<QuizWizardDialogComponent>;
  let dialogRef: jest.Mocked<MatDialogRef<QuizWizardDialogComponent>>;

  beforeEach(async () => {
    dialogRef = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<QuizWizardDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [QuizWizardDialogComponent, getTranslocoTestingModule()],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizWizardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start on the select_type step', () => {
      expect(component.currentStep()).toBe('select_type');
    });

    it('should have no selected type initially', () => {
      expect(component.selectedType()).toBeNull();
    });
  });

  describe('selectType()', () => {
    it('should set the selected type and advance to select_creation_method', () => {
      component.selectType('assessment');

      expect(component.selectedType()).toBe('assessment');
      expect(component.currentStep()).toBe('select_creation_method');
    });

    it('should support research type selection for future use', () => {
      component.selectType('research');

      expect(component.selectedType()).toBe('research');
      expect(component.currentStep()).toBe('select_creation_method');
    });
  });

  describe('selectCreationMethod()', () => {
    it('should close the dialog with the selected quiz type and creation method', () => {
      component.selectType('assessment');
      component.selectCreationMethod('manual');

      expect(dialogRef.close).toHaveBeenCalledWith({ quizType: 'assessment', creationMethod: 'manual' });
    });

    it('should support ai_assisted method for future use', () => {
      component.selectType('assessment');
      component.selectCreationMethod('ai_assisted');

      expect(dialogRef.close).toHaveBeenCalledWith({ quizType: 'assessment', creationMethod: 'ai_assisted' });
    });

    it('should not close the dialog if no type has been selected yet', () => {
      component.selectCreationMethod('manual');

      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('onBack()', () => {
    it('should close the dialog without a result when on the first step', () => {
      component.onBack();

      expect(dialogRef.close).toHaveBeenCalledWith();
    });

    it('should navigate back to select_type when on the select_creation_method step', () => {
      component.selectType('assessment');

      component.onBack();

      expect(component.currentStep()).toBe('select_type');
      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });
});
