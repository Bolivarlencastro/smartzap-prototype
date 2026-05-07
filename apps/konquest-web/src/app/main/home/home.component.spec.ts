import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LearnContentActions } from '@app/shared/store';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentActionData } from '@keeps-platform-frontend-workspace/ui/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HomeComponent } from './home.component';
import { BannerActionData } from './models/banners';
import { BannersActions, BannerSettingsActions, HomeActions } from './store/actions';
import { homeInitialState } from './store/features';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [
        provideMockStore({ initialState: homeInitialState }),
        { provide: UserProfileService, useValue: { isAdmin$: jest.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filter', 'learning-trails');

    fixture.detectChanges();
  });

  it('should dispatch loadSections and init actions on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(HomeActions.init());
    expect(store.dispatch).toHaveBeenCalledWith(HomeActions.loadSections({ id: 'learning-trails' }));
  });

  it('should dispatch banner action', () => {
    const data: BannerActionData = { item: null, action: 'details' };
    component.onBannerAction(data);
    expect(store.dispatch).toHaveBeenCalledWith(BannersActions.dispatchAction({ data }));
  });

  it('should dispatch openDialog action to open banner settings', () => {
    component.onOpenBannerSettings();
    expect(store.dispatch).toHaveBeenCalledWith(BannerSettingsActions.openDialog());
  });

  it('should dispatch learnContentAction action', () => {
    const learnContentAction: LearnContentActionData = {
      learnContent: null,
      contentType: 'mission',
      action: 'share',
    };
    component.onCardAction(learnContentAction);
    expect(store.dispatch).toHaveBeenCalledWith(LearnContentActions.learnContentAction({ learnContentAction }));
  });
});
