import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GlobalSettingsActions } from '@app/shared/store/actions';
import { globalSettingsFeature, globalSettingsInitialState } from '@app/shared/store/features';
import { SmartzapConfiguration } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { SettingsGeneralComponent } from './general.component';

const mockSmartzapConfiguration: SmartzapConfiguration = {
  messagesContentEmbed: true,
  sendCoursesRecommendationMessage: true,
  sendCourseReminderMessage: false,
  interactWithRandomMessages: true,
  enrollmentIdleDaysLimit: 14,
  coursesPortalUrl: 'https://example.com',
};

describe('SettingsGeneralComponent', () => {
  let component: SettingsGeneralComponent;
  let fixture: ComponentFixture<SettingsGeneralComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsGeneralComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { globalSettingsFeature: globalSettingsInitialState } })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(SettingsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('form patching from store', () => {
    it('should patch smartzapConfigForm when store emits a configuration', () => {
      store.overrideSelector(globalSettingsFeature.selectSmartzapConfiguration, mockSmartzapConfiguration);
      store.refreshState();
      fixture.detectChanges();

      const controls = component.smartzapConfigForm.controls;
      expect(controls.messagesContentEmbed.value).toBe(true);
      expect(controls.sendCoursesRecommendationMessage.value).toBe(true);
      expect(controls.sendCourseReminderMessage.value).toBe(false);
      expect(controls.interactWithRandomMessages.value).toBe(true);
      expect(controls.enrollmentIdleDaysLimit.value).toBe(14);
      expect(controls.coursesPortalUrl.value).toBe('https://example.com');
    });

    it('should mark smartzapConfigForm as pristine after patching', () => {
      store.overrideSelector(globalSettingsFeature.selectSmartzapConfiguration, mockSmartzapConfiguration);
      store.refreshState();
      fixture.detectChanges();

      expect(component.smartzapConfigForm.pristine).toBe(true);
    });

    it('should patch userTokenExpirationForm when store emits a workspace', () => {
      store.overrideSelector(globalSettingsFeature.selectWorkspace, { user_token_expiration: 20 } as any);
      store.refreshState();
      fixture.detectChanges();

      expect(component.userTokenExpirationForm.value).toBe(20);
      expect(component.userTokenExpirationForm.pristine).toBe(true);
    });
  });

  describe('smartzapConfigForm validation', () => {
    it('should validate enrollmentIdleDaysLimit minimum value', () => {
      component.smartzapConfigForm.controls.enrollmentIdleDaysLimit.setValue(6);
      expect(component.smartzapConfigForm.controls.enrollmentIdleDaysLimit.hasError('min')).toBe(true);
    });

    it('should validate enrollmentIdleDaysLimit maximum value', () => {
      component.smartzapConfigForm.controls.enrollmentIdleDaysLimit.setValue(31);
      expect(component.smartzapConfigForm.controls.enrollmentIdleDaysLimit.hasError('max')).toBe(true);
    });

    it('should accept valid enrollmentIdleDaysLimit', () => {
      component.smartzapConfigForm.controls.enrollmentIdleDaysLimit.setValue(14);
      expect(component.smartzapConfigForm.controls.enrollmentIdleDaysLimit.valid).toBe(true);
    });

    it('should validate coursesPortalUrl pattern', () => {
      component.smartzapConfigForm.controls.coursesPortalUrl.setValue('invalid-url');
      expect(component.smartzapConfigForm.controls.coursesPortalUrl.hasError('pattern')).toBe(true);
    });

    it('should accept valid coursesPortalUrl', () => {
      component.smartzapConfigForm.controls.coursesPortalUrl.setValue('https://example.com');
      expect(component.smartzapConfigForm.controls.coursesPortalUrl.valid).toBe(true);
    });
  });

  describe('userTokenExpirationForm validation', () => {
    it('should require a value', () => {
      component.userTokenExpirationForm.setValue(null);
      expect(component.userTokenExpirationForm.hasError('required')).toBe(true);
    });

    it('should validate minimum value', () => {
      component.userTokenExpirationForm.setValue(0);
      expect(component.userTokenExpirationForm.hasError('min')).toBe(true);
    });
  });

  describe('store dispatches', () => {
    it('should dispatch updateSmartzapConfiguration when form is valid, dirty and debounced', fakeAsync(() => {
      component.smartzapConfigForm.controls.sendCourseReminderMessage.setValue(true);
      component.smartzapConfigForm.markAsDirty();

      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        GlobalSettingsActions.updateSmartzapConfiguration({
          smartzapConfiguration: component.smartzapConfigForm.value as SmartzapConfiguration,
        }),
      );
    }));

    it('should not dispatch updateSmartzapConfiguration when form is invalid', fakeAsync(() => {
      component.smartzapConfigForm.controls.enrollmentIdleDaysLimit.setValue(6);
      component.smartzapConfigForm.markAsDirty();

      tick(500);

      expect(store.dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: GlobalSettingsActions.updateSmartzapConfiguration.type }),
      );
    }));

    it('should dispatch updateUserTokenExpiration when form is valid, dirty and debounced', fakeAsync(() => {
      component.userTokenExpirationForm.setValue(20);
      component.userTokenExpirationForm.markAsDirty();

      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        GlobalSettingsActions.updateUserTokenExpiration({ user_token_expiration: 20 }),
      );
    }));

    it('should not dispatch updateUserTokenExpiration when form is invalid', fakeAsync(() => {
      component.userTokenExpirationForm.setValue(0);
      component.userTokenExpirationForm.markAsDirty();

      tick(500);

      expect(store.dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: GlobalSettingsActions.updateUserTokenExpiration.type }),
      );
    }));
  });
});
