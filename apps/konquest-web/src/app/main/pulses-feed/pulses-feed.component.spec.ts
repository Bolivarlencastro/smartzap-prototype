jest.mock('emoji-picker-element', () => ({}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { categoriesInitialState } from '@app/shared/store/features';
import { PulsesFeedComponent } from './pulses-feed.component';
import { FeedActions } from './store';
import { feedInitialState } from './store/feed/feed.feature';
import { pulsesListInitialState } from './store/pulses-list/pulses-list.feature';
import { channelsListInitialState } from './store/channels-list/channels-list.feature';

describe('PulsesFeedComponent', () => {
  let component: PulsesFeedComponent;
  let fixture: ComponentFixture<PulsesFeedComponent>;
  let store: MockStore;
  let userProfileServiceMock: jest.Mocked<Pick<UserProfileService, 'isCurator'>>;

  beforeEach(async () => {
    userProfileServiceMock = { isCurator: jest.fn().mockReturnValue(false) };

    await TestBed.configureTestingModule({
      imports: [PulsesFeedComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({
          initialState: {
            pulsesFeed: feedInitialState,
            categoriesFeature: categoriesInitialState,
            pulsesList: pulsesListInitialState,
            channelsList: channelsListInitialState,
          },
        }),
        { provide: UserProfileService, useValue: userProfileServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PulsesFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch FeedActions.init with isCurator false on construction', () => {
    expect(store.dispatch).toHaveBeenCalledWith(FeedActions.init({ isCurator: false }));
  });

  it('should dispatch FeedActions.init with isCurator true when user is curator', async () => {
    userProfileServiceMock.isCurator.mockReturnValue(true);

    const curatorFixture = TestBed.createComponent(PulsesFeedComponent);
    curatorFixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(FeedActions.init({ isCurator: true }));
  });
});
