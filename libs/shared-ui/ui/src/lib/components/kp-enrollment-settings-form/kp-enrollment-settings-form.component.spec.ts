import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpFormMenuComponent } from './components/kp-form-menu.component';
import { KpEnrollmentSettingsFormComponent } from './kp-enrollment-settings-form.component';
import { EnrollmentConfig, EnrollmentType } from './model';

describe('KpEnrollmentSettingsFormComponent', () => {
  let component: KpEnrollmentSettingsFormComponent;
  let fixture: ComponentFixture<KpEnrollmentSettingsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        getTranslocoTestingModule(),
        MatDateFnsModule,
        ReactiveFormsModule,
        KpEnrollmentSettingsFormComponent,
        KpFormMenuComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(KpEnrollmentSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should close the menu when closeMenu is called', () => {
    const spy = jest.spyOn(component.menuTrigger, 'closeMenu');
    component.closeMenu();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit formSubmit event when onSubmit is called', () => {
    const formData: EnrollmentConfig = {
      enrollmentType: EnrollmentType.COMPLIANCE,
      date: '2023-01-01',
      cycle: { id: 'mock_cycle_id' } as CycleDto,
    };
    const spy = jest.spyOn(component.formSubmit, 'emit');

    component.onSubmit(formData);
    expect(spy).toHaveBeenCalledWith(formData);
  });

  describe('onFilterCycle', () => {
    it('should emit filterCycle event', () => {
      const emitSpy = jest.spyOn(component.filterCycle, 'emit');

      component.onFilterCycle('mock_search');

      expect(emitSpy).toHaveBeenCalledWith('mock_search');
    });
  });
});
