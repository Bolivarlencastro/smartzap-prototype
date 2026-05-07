import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchEnrollmentActionsComponent } from './batch-enrollment-actions.component';
import { EnrollmentConfig, EnrollmentType } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ptBR } from 'date-fns/locale';

describe('BatchEnrollmentActionsComponent', () => {
  let component: BatchEnrollmentActionsComponent;
  let fixture: ComponentFixture<BatchEnrollmentActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BatchEnrollmentActionsComponent, getTranslocoTestingModule()],
      providers: [provideDateFnsAdapter(), { provide: MAT_DATE_LOCALE, useValue: ptBR }],
    });
    fixture = TestBed.createComponent(BatchEnrollmentActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('positiveButtonLabel', () => {
    const cases: any[] = [
      ['BATCH_ENROLLMENT.ACTIONS.FINISH', 'finish'],
      ['GENERAL.CONTINUE', 'notFound'],
      ['BATCH_ENROLLMENT.ACTIONS.ENROLL_USERS', 'list'],
      ['BATCH_ENROLLMENT.ACTIONS.ENROLL_USERS', 'resume'],
    ];
    test.each(cases)('should return the translation label %p for view mode %p', (expectedTranslation, viewMode) => {
      component.viewMode = viewMode;

      expect(component.positiveButtonLabel).toBe(expectedTranslation);
    });
  });

  describe('negativeButtonLabel', () => {
    const cases: any[] = [
      ['BATCH_ENROLLMENT.ACTIONS.ENROLL_OTHERS', 'finish'],
      ['BATCH_ENROLLMENT.ACTIONS.SELECT_MORE', 'notFound'],
      ['GENERAL.CANCEL', 'list'],
      ['BATCH_ENROLLMENT.ACTIONS.SELECT_MORE', 'resume'],
    ];
    test.each(cases)('should return the translation label %p for view mode %p', (expectedTranslation, viewMode) => {
      component.viewMode = viewMode;

      expect(component.negativeButtonLabel).toBe(expectedTranslation);
    });
  });

  describe('showConfigForm', () => {
    it('should be true when view is different from finish and resume', () => {
      component.viewMode = 'list';
      expect(component.showConfigForm).toBe(true);

      fixture.componentRef.setInput('viewMode', 'notFound');
      expect(component.showConfigForm).toBe(true);
    });
  });

  describe('onSettingsSubmit', () => {
    it('should emit setEnrollmentConfig', () => {
      const emitSpy = jest.spyOn(component.setEnrollmentConfig, 'emit');
      const mockSettings: EnrollmentConfig = { enrollmentType: EnrollmentType.FREE, date: '2023-09-19' };

      component.onSettingsSubmit(mockSettings);

      expect(emitSpy).toHaveBeenCalledWith(mockSettings);
    });
  });

  describe('onPositiveClick', () => {
    it('should emit closeDialog when viewMode equals finish', () => {
      const emitSpy = jest.spyOn(component.closeDialog, 'emit');
      component.viewMode = 'finish';

      component.onPositiveClick();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit continue when viewMode equals notFound', () => {
      const emitSpy = jest.spyOn(component.continue, 'emit');
      component.viewMode = 'notFound';

      component.onPositiveClick();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit continue by default', () => {
      const emitSpy = jest.spyOn(component.enroll, 'emit');
      component.viewMode = undefined;

      component.onPositiveClick();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onNegativeClick', () => {
    it('should emit enrollOthers with a value of true when viewMode equals finish', () => {
      const emitSpy = jest.spyOn(component.enrollOthers, 'emit');
      component.viewMode = 'finish';

      component.onNegativeClick();

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should emit enrollOthers with a value of false when viewMode equals notFound or resume', () => {
      const emitSpy = jest.spyOn(component.enrollOthers, 'emit');
      component.viewMode = 'notFound';

      component.onNegativeClick();
      component.viewMode = 'resume';
      component.onNegativeClick();

      expect(emitSpy).toHaveBeenCalledTimes(2);
      expect(emitSpy).not.toHaveBeenCalledWith(true);
    });

    it('should emit closeDialog by default', () => {
      const emitSpy = jest.spyOn(component.closeDialog, 'emit');
      component.viewMode = undefined;

      component.onNegativeClick();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onFilterCycle', () => {
    it('should emit filterCycle event', () => {
      const emitSpy = jest.spyOn(component.filterCycle, 'emit');

      component.onFilterCycle('mock_search');

      expect(emitSpy).toHaveBeenCalledWith('mock_search');
    });
  });
});
