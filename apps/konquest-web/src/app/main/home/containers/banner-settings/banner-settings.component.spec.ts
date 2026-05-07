import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CustomSettings } from '../../models/banner-settings';
import { BannerSettingsActions } from '../../store/actions';
import { bannerSettingsInitialState } from '../../store/features';
import { BannerSettingsComponent } from './banner-settings.component';

describe('BannerSettingsComponent', () => {
  let component: BannerSettingsComponent;
  let fixture: ComponentFixture<BannerSettingsComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerSettingsComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: bannerSettingsInitialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(BannerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('setMode', () => {
    const cases: any[] = [
      ['MANUAL', { checked: true, source: null }],
      ['RECOMMENDATION', { checked: false, source: null }],
    ];

    test.each(cases)('should dispatch %p mode for this event: %p', (mode, event) => {
      component.onSetMode(event);
      expect(store.dispatch).toHaveBeenCalledWith(BannerSettingsActions.setMode({ mode }));
    });
  });

  it('should dispatch loadInternalContents action', () => {
    const search = 'test';
    component.onFilterInternalContents(search);
    expect(store.dispatch).toHaveBeenCalledWith(BannerSettingsActions.loadInternalContents({ search }));
  });

  it('should dispatch publish action', () => {
    const data = component.form.value as CustomSettings;
    component.onPublish();
    expect(store.dispatch).toHaveBeenCalledWith(BannerSettingsActions.publish({ data }));
  });

  it('should dispatch close action', () => {
    component.onClose();
    expect(store.dispatch).toHaveBeenCalledWith(BannerSettingsActions.close({ dirtyForm: component.form.dirty }));
  });
});
