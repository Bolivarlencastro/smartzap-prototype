import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpEnrollmentSettingResumeComponent } from './kp-enrollment-setting-resume.component';
import { EnrollmentConfig, EnrollmentType } from '../../model';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';

describe('KpEnrollmentSettingResumeComponent', () => {
  let component: KpEnrollmentSettingResumeComponent;
  let fixture: ComponentFixture<KpEnrollmentSettingResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpEnrollmentSettingResumeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpEnrollmentSettingResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('enrollmentConfig', () => {
    it('should set the properties following the provided enrollment configuration', () => {
      const mockCycle = { compliance: { name: 'mock_compliance_name' } } as CycleDto;
      const mockConfig: EnrollmentConfig = {
        enrollmentType: EnrollmentType.FREE,
        date: '2023-09-19',
        cycle: mockCycle,
      };

      fixture.componentRef.setInput('enrollmentConfig', mockConfig);
      fixture.detectChanges();

      expect(component.resume).toBe('UI.KP_ENROLLMENT_SETTINGS_FORM.RESUME.OPEN');
      expect(component.cycle).toBe('mock_compliance_name');
      expect(component.date).toBe('2023-09-19');
    });
  });
});
