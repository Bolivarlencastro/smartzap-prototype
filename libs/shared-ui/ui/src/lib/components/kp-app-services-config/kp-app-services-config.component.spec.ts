import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AppServicesConfig } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpAppServicesConfigComponent } from './kp-app-services-config.component';

const mockAppServicesConfig: AppServicesConfig = {
  KONQUEST_MISSION: true,
  KONQUEST_EVENT: true,
  KONQUEST_PULSE: true,
  KONQUEST_LEARNING_TRAIL: true,
  KONQUEST_REGULATORY_COMPLIANCE: true,
  KONQUEST_DASHBOARD: true,
  KONQUEST_GAMIFICATION: true,
  SMARTZAP: true,
  LEARN_ANALYTICS: true,
};

describe('KpAppServicesConfigComponent', () => {
  let component: KpAppServicesConfigComponent;
  let fixture: ComponentFixture<KpAppServicesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpAppServicesConfigComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpAppServicesConfigComponent);
    component = fixture.componentInstance;
  });

  describe('with inputs provided', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('appServicesConfig', mockAppServicesConfig);
      fixture.detectChanges();
    });

    describe('onChangeAppStatus', () => {
      it('should emit appStatusChanged with correct data when toggle changes', () => {
        const mockEvent = { checked: true } as MatSlideToggleChange;
        const serviceName = 'SMARTZAP';
        const emitSpy = jest.spyOn(component.appStatusChanged, 'emit');

        component.onChangeAppStatus(mockEvent, serviceName);

        expect(emitSpy).toHaveBeenCalledWith({
          checked: true,
          service: serviceName,
        });
      });
    });

    describe('Computed Properties', () => {
      it('should compute dataSource from appServicesConfig keys', () => {
        const dataSource = component.dataSource();
        expect(dataSource).toEqual(Object.keys(mockAppServicesConfig));
        expect(dataSource.length).toBe(9);
      });
    });
  });

  describe('with empty appServicesConfig', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('appServicesConfig', undefined);
      fixture.detectChanges();
    });

    it('should handle empty appServicesConfig', () => {
      const dataSource = component.dataSource();
      expect(dataSource).toEqual([]);
    });
  });
});
