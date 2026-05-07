jest.mock('emoji-picker-element', () => ({}));
jest.mock('app/shared/services', () => ({
  navigateToPulse: jest.fn(),
}));

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { navigateToPulse } from 'app/shared/services';
import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { ChannelsListActions, PulsesListActions, PulseChannelActions } from '../../store';
import { FeedListComponent } from './feed-list.component';
import { Pulse } from '../../models/pulse';

describe('FeedListComponent', () => {
  let component: FeedListComponent;
  let fixture: ComponentFixture<FeedListComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedListComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onPulsesScroll', () => {
    it('should dispatch fetchMorePulses action', () => {
      jest.spyOn(store, 'dispatch');
      component.onPulsesScroll();
      expect(store.dispatch).toHaveBeenCalledWith(PulsesListActions.fetchMorePulses());
    });
  });

  describe('onChannelsScroll', () => {
    it('should dispatch fetchMoreChannels action', () => {
      jest.spyOn(store, 'dispatch');
      component.onChannelsScroll();
      expect(store.dispatch).toHaveBeenCalledWith(ChannelsListActions.fetchMoreChannels());
    });
  });

  describe('onOpenPulse', () => {
    beforeEach(() => {
      jest.spyOn(store, 'dispatch');
      (navigateToPulse as jest.Mock).mockClear();
    });

    it('should dispatch openedFromFeed and call navigateToPulse when pulse is active', () => {
      component.onOpenPulse({ id: 'pulse-123', is_active: true } as Pulse);
      expect(store.dispatch).toHaveBeenCalledWith(PulsesListActions.openedFromFeed());
      expect(navigateToPulse).toHaveBeenCalledWith(router, 'pulse-123');
    });

    it('should not dispatch openedFromFeed or call navigateToPulse when pulse is inactive', () => {
      component.onOpenPulse({ id: 'pulse-123', is_active: false } as Pulse);
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(navigateToPulse).not.toHaveBeenCalled();
    });
  });

  describe('onChannelClick', () => {
    it('should navigate to channel details', () => {
      component.onChannelClick('channel-456');
      expect(router.navigate).toHaveBeenCalledWith(['/channels/details', 'channel-456']);
    });
  });

  describe('onChannelSubscribe', () => {
    it('should dispatch toggleSubscription action with channelId and subscriptionId', () => {
      jest.spyOn(store, 'dispatch');
      const channel: KpChannelCardModel = {
        id: 'channel-789',
        name: 'Test Channel',
        category: 'Test',
        cover_image: '',
        language: 'en',
        is_active: true,
        is_owner: false,
        is_contributor: false,
        subscription_id: 'sub-001',
        stats: { pulses_count: 10, subscribers_count: 5, rating: 4 },
      };

      component.onChannelSubscribe(channel);

      expect(store.dispatch).toHaveBeenCalledWith(
        ChannelsListActions.toggleSubscription({ channelId: 'channel-789', subscriptionId: 'sub-001' }),
      );
    });

    it('should dispatch toggleSubscription with null subscriptionId when not subscribed', () => {
      jest.spyOn(store, 'dispatch');
      const channel: KpChannelCardModel = {
        id: 'channel-789',
        name: 'Test Channel',
        category: 'Test',
        cover_image: '',
        language: 'en',
        is_active: true,
        is_owner: false,
        is_contributor: false,
        subscription_id: '',
        stats: { pulses_count: 10, subscribers_count: 5, rating: 4 },
      };

      component.onChannelSubscribe(channel);

      expect(store.dispatch).toHaveBeenCalledWith(
        ChannelsListActions.toggleSubscription({ channelId: 'channel-789', subscriptionId: null }),
      );
    });
  });

  describe('onToggleBookmark', () => {
    it('should dispatch toggleBookmark action', () => {
      jest.spyOn(store, 'dispatch');
      const pulse = { id: '123', bookmark_id: 'bookmark-001' } as Pulse;
      component.onToggleBookmark(pulse);
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleBookmark({ pulseId: '123', bookmarkId: 'bookmark-001' }),
      );
    });
  });
});
