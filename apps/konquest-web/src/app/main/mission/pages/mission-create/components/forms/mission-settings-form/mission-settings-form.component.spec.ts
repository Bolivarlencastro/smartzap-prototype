import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Mission, MissionModel } from 'app/main/mission/mission.model';
import { MissionSettingsFormComponent } from './mission-settings-form.component';
import { Chance } from 'chance';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideNgxMask } from 'ngx-mask';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ptBR } from 'date-fns/locale';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('MissionSettingsFormComponent', () => {
  let component: MissionSettingsFormComponent;
  let fixture: ComponentFixture<MissionSettingsFormComponent>;
  const chance = new Chance();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionSettingsFormComponent, getTranslocoTestingModule()],
      providers: [
        provideNoopAnimations(),
        provideNgxMask(),
        provideDateFnsAdapter(),
        {
          provide: MAT_DATE_LOCALE,
          useValue: ptBR,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionSettingsFormComponent);
    component = fixture.componentInstance;
    component.missionModel = MissionModel.INTERNAL;
    fixture.detectChanges();
  });

  describe('getSettings', () => {
    const presentialSettings: Partial<Mission> = {
      minimum_performance: 0,
      expiration_date: '',
      presential: {
        notify_users_enrolled: false,
      } as any,
    };

    const liveSettings: Partial<Mission> = {
      minimum_performance: 0,
      expiration_date: '',
      live: {
        notify_users_enrolled: false,
        auto_attendance: false,
      } as any,
    };

    const defaultMissionSettings = {
      is_active: true,
      required_evaluation: false,
      allow_self_enrollment_renewal: false,
      allow_self_reproved_enrollment_renewal: false,
      minimum_performance: 0,
      min_time_in_content: 0.1,
      expiration_date: '',
      enrollment_goal_duration_days: null,
    };

    it('should return the default mission settings', () => {
      expect(component.getSettings()).toEqual(defaultMissionSettings);
    });

    it('should return the settings for a presential mission', () => {
      component.missionModel = MissionModel.PRESENTIAL;
      fixture.componentRef.setInput('missionModel', MissionModel.PRESENTIAL);
      fixture.detectChanges();

      expect(component.getSettings()).toEqual(presentialSettings);
    });

    it('should return the settings for a live mission', () => {
      fixture.componentRef.setInput('missionModel', MissionModel.LIVE);
      fixture.detectChanges();

      expect(component.getSettings()).toEqual(liveSettings);
    });

    it('should return the formatted expiration date', () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-05-23T00:00:00'));
      const expectedSettings = { ...defaultMissionSettings, expiration_date: '2023-05-23' };

      fixture.componentRef.setInput('mission', { expiration_date: '2023-05-23' });
      fixture.detectChanges();

      expect(component.getSettings()).toEqual(expectedSettings);
      jest.useRealTimers();
    });

    it('should return the formatted minimum performance', () => {
      const expectedSettings = { ...defaultMissionSettings, minimum_performance: 0.25 };

      fixture.componentRef.setInput('mission', { minimum_performance: 0.25 });
      fixture.detectChanges();

      expect(component.getSettings()).toEqual(expectedSettings);
    });
  });

  describe('customGoalDateToggleChange', () => {
    it('should reset the enrollment_goal_duration_days value if the toggle is unchecked', () => {
      fixture.componentRef.setInput('mission', { enrollment_goal_duration_days: 45 });
      fixture.detectChanges();

      component.customGoalDateToggleChange({ checked: false } as MatSlideToggleChange);

      expect(component.getSettings().enrollment_goal_duration_days).toEqual(null);
    });
  });

  describe('minimumPerformanceToggleChange', () => {
    it('should reset the minimum_performance value if the toggle is unchecked', () => {
      fixture.componentRef.setInput('mission', { minimum_performance: 10 });
      fixture.detectChanges();

      component.minimumPerformanceToggleChange({ checked: false } as MatSlideToggleChange);

      expect(component.getSettings().minimum_performance).toEqual(0);
    });
  });

  describe('temporaryToggleChange', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('mission', { expiration_date: '' });
      fixture.detectChanges();
    });

    describe('when checked', () => {
      it('should set the required validator on the formControl', () => {
        component.temporaryToggleChange({ checked: true } as MatSlideToggleChange);

        expect(component.invalid).toBe(true);
      });
    });

    describe('when unchecked', () => {
      it('should reset the expiration_date value if the toggle is unchecked', () => {
        fixture.componentRef.setInput('mission', { expiration_date: new Date() });
        fixture.detectChanges();

        component.temporaryToggleChange({ checked: false } as MatSlideToggleChange);

        expect(component.getSettings().expiration_date).toEqual('');
      });

      it('should remove the formControl validators', () => {
        component.temporaryToggleChange({ checked: false } as MatSlideToggleChange);

        expect(component.invalid).toBe(false);
      });
    });

    it('should reset the expiration_date value if the toggle is unchecked', () => {
      component.temporaryToggleChange({ checked: false } as MatSlideToggleChange);

      expect(component.getSettings().expiration_date).toEqual('');
    });
  });

  it('should emit the form value after 1000 milliseconds', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.formChange, 'emit');

    component.temporaryToggleChange({ checked: false } as MatSlideToggleChange);
    tick(1100);

    expect(emitSpy).toHaveBeenCalled();
  }));

  it('should not emit the form value after 1000 milliseconds if it is invalid', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.formChange, 'emit');

    component.temporaryToggleChange({ checked: true } as MatSlideToggleChange);
    fixture.componentRef.setInput('mission', { is_active: true, expiration_date: '' });
    fixture.detectChanges();
    tick(1100);

    expect(emitSpy).not.toHaveBeenCalled();
  }));

  it('should emit previewCertificate event', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    const event = { stopPropagation: jest.fn() };
    const emitSpy = jest.spyOn(component.previewCertificate, 'emit');

    component.onPreviewCertificate(certificate, event as unknown as Event);

    expect(emitSpy).toHaveBeenCalledWith(certificate);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  describe('onCertificateChange', () => {
    it('should emit emit the certificate change event', () => {
      const certificate = { id: chance.guid() } as CustomCertificateDto;
      const emitSpy = jest.spyOn(component.certificateChange, 'emit');
      const mockMission: Partial<Mission> = { id: chance.guid() };
      fixture.componentRef.setInput('mission', mockMission);
      fixture.detectChanges();

      component.onCertificateChange(certificate);

      expect(emitSpy).toHaveBeenCalledWith({ certificate, learnContentId: mockMission.id });
    });

    it('should not emit the certificate change event when the certificate is null', () => {
      const emitSpy = jest.spyOn(component.certificateChange, 'emit');

      component.onCertificateChange(null);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('certificateToggleChange', () => {
    it('should emit emit the certificate change event when the the toggle is unchecked', () => {
      const emitSpy = jest.spyOn(component.certificateChange, 'emit');
      const mockMission: Partial<Mission> = { id: chance.guid() };
      fixture.componentRef.setInput('mission', mockMission);
      fixture.detectChanges();

      component.certificateToggleChange({ checked: false } as MatSlideToggleChange);

      expect(emitSpy).toHaveBeenCalledWith({ learnContentId: mockMission.id, certificate: null });
    });

    it('should not emit the certificate change event when the toggle is checked', () => {
      const emitSpy = jest.spyOn(component.certificateChange, 'emit');

      component.certificateToggleChange({ checked: true } as MatSlideToggleChange);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('newCertificate', () => {
    it('should emit newCertificate event', () => {
      const emitSpy = jest.spyOn(component.newCertificate, 'emit');

      component.onNewCertificate();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('integration mission', () => {
    it('should disable the inputs when the mission is from an integration', () => {
      const mockMission: Partial<Mission> = { is_integration: true };
      const disableSpy = jest.spyOn(component.settingsForm, 'disable');

      fixture.componentRef.setInput('mission', mockMission);
      fixture.detectChanges();

      expect(disableSpy).toHaveBeenCalled();
      expect(component.settingsForm.get('is_active').enabled).toBe(true);
      expect(component.settingsForm.get('required_evaluation').enabled).toBe(true);
    });
  });
});
