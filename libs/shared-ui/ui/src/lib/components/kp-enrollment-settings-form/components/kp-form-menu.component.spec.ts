import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DateFnsModule } from '@angular/material-date-fns-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CycleDto, KEEPS_DATE_FORMATS } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ptBR } from 'date-fns/locale';
import { getTranslocoTestingModule } from '../../../transloco-testing.module';
import { EnrollmentConfig, EnrollmentType, EnrollmentTypeOptions } from '../model';
import { KpFormMenuComponent } from './kp-form-menu.component';

describe('KpFormMenuComponent', () => {
  let component: KpFormMenuComponent;
  let fixture: ComponentFixture<KpFormMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: ptBR },
        {
          provide: MAT_DATE_FORMATS,
          useValue: KEEPS_DATE_FORMATS,
        },
      ],
      imports: [
        NoopAnimationsModule,
        getTranslocoTestingModule(),
        DateFnsModule,
        ReactiveFormsModule,
        KpFormMenuComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(KpFormMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the current config as the form value', () => {
    const mockCycle = {
      id: 'mock_cycle_id',
      compliance: { id: 'mock_compliance_id', name: 'Mock Compliance' },
    } as CycleDto;

    const enrollmentConfig: EnrollmentConfig = {
      date: '2023-01-01',
      enrollmentType: EnrollmentType.COMPLIANCE,
      cycle: mockCycle,
    };

    fixture.componentRef.setInput('enrollmentConfig', enrollmentConfig);
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual(enrollmentConfig);
  });

  it('should emit formSubmit event when onSubmit is called', () => {
    const formData = {
      date: '2023-01-01T12:00:00Z',
      enrollmentType: EnrollmentType.FREE,
      cycle: null,
    };

    const spy = jest.spyOn(component.formSubmit, 'emit');
    component.form.setValue(formData);

    component.onSubmit();
    expect(spy).toHaveBeenCalledWith(formData);
  });

  it('should emit filterCycle event', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterCycle, 'emit');

    component.form.get('cycle').setValue('mock_cycle_name');
    tick(210);

    expect(emitSpy).toHaveBeenCalledWith('mock_cycle_name');
  }));

  it('should emit closeEvent when closeMenu is called', () => {
    const spy = jest.spyOn(component.closeEvent, 'emit');
    component.closeMenu();
    expect(spy).toHaveBeenCalled();
  });

  describe('enrollmentTypeOptions', () => {
    it('should return the enrollmentTypeOptions filtering the compliance option by default', () => {
      fixture.componentRef.setInput('isNormativeActive', true);

      const expectedOptions: EnrollmentTypeOptions[] = [
        {
          label: 'UI.KP_ENROLLMENT_SETTINGS_FORM.FREE_ENROLLMENT_TYPE',
          value: EnrollmentType.FREE,
        },
        {
          label: 'UI.KP_ENROLLMENT_SETTINGS_FORM.REQUIRED_ENROLLMENT_TYPE',
          value: EnrollmentType.REQUIRED,
        },
        {
          label: 'UI.KP_ENROLLMENT_SETTINGS_FORM.COMPLIANCE_ENROLLMENT_TYPE',
          value: EnrollmentType.COMPLIANCE,
        },
      ];

      expect(component.enrollmentTypeOptions).toEqual(expectedOptions);
    });

    it('should return the enrollmentTypeOptions not including the compliance option when isNormativeActive is true', () => {
      const expectedOptions: EnrollmentTypeOptions[] = [
        {
          label: 'UI.KP_ENROLLMENT_SETTINGS_FORM.FREE_ENROLLMENT_TYPE',
          value: EnrollmentType.FREE,
        },
        {
          label: 'UI.KP_ENROLLMENT_SETTINGS_FORM.REQUIRED_ENROLLMENT_TYPE',
          value: EnrollmentType.REQUIRED,
        },
      ];

      fixture.componentRef.setInput('isNormativeActive', false);
      fixture.detectChanges();

      expect(component.enrollmentTypeOptions).toEqual(expectedOptions);
    });
  });
});
