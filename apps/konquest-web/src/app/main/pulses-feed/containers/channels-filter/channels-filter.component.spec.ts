jest.mock('emoji-picker-element', () => ({}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Signal } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { ChannelsFilterComponent } from './channels-filter.component';
import { FeedActions, feedFeature } from '../../store';
import { ChannelPulseSideItem } from '../../models/channel';
import { ChannelsFilterViewModel } from '../../models/view-models';

type ChannelsFilterProtected = {
  visibleCreatedByMe: Signal<ChannelPulseSideItem[]>;
  visibleSubscribed: Signal<ChannelPulseSideItem[]>;
  showAllSubscribed: Signal<boolean>;
};

const mockVm: ChannelsFilterViewModel = {
  isCurator: true,
  selectedTab: 'feed',
  createdByMe: {
    loading: false,
    items: [
      { id: 'c1', name: 'Channel 1', cover_image: '' },
      { id: 'c2', name: 'Channel 2', cover_image: '' },
      { id: 'c3', name: 'Channel 3', cover_image: '' },
      { id: 'c4', name: 'Channel 4', cover_image: '' },
      { id: 'c5', name: 'Channel 5', cover_image: '' },
    ],
  },
  subscribed: {
    loading: false,
    items: [
      { id: 's1', name: 'Subscribed 1', cover_image: '' },
      { id: 's2', name: 'Subscribed 2', cover_image: '' },
    ],
  },
  selectedChannelId: null,
};

describe('ChannelsFilterComponent', () => {
  let component: ChannelsFilterComponent;
  let fixture: ComponentFixture<ChannelsFilterComponent>;
  let store: MockStore;
  let router: { navigate: jest.Mock };

  beforeEach(async () => {
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ChannelsFilterComponent, getTranslocoTestingModule()],
      providers: [provideMockStore(), { provide: Router, useValue: router }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(feedFeature.selectChannelsFilterViewModel, mockVm);
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('visibleCreatedByMe', () => {
    it('should show max 4 items by default', () => {
      expect((fixture.componentInstance as unknown as ChannelsFilterProtected).visibleCreatedByMe().length).toBe(4);
    });

    it('should show all items after toggleShowAllCreatedByMe', () => {
      component.toggleShowAllCreatedByMe();
      expect((fixture.componentInstance as unknown as ChannelsFilterProtected).visibleCreatedByMe().length).toBe(5);
    });

    it('should return to max 4 when toggled back', () => {
      component.toggleShowAllCreatedByMe();
      component.toggleShowAllCreatedByMe();
      expect((fixture.componentInstance as unknown as ChannelsFilterProtected).visibleCreatedByMe().length).toBe(4);
    });
  });

  describe('visibleSubscribed', () => {
    it('should show all items when count is under the max', () => {
      expect((fixture.componentInstance as unknown as ChannelsFilterProtected).visibleSubscribed().length).toBe(2);
    });

    it('should toggle showAllSubscribed', () => {
      component.toggleShowAllSubscribed();
      expect((fixture.componentInstance as unknown as ChannelsFilterProtected).showAllSubscribed()).toBe(true);
    });
  });

  describe('onSelectFeed', () => {
    it('should dispatch selectChannel with null channelId', () => {
      component.onSelectFeed();
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.selectChannel({ channelId: null }));
    });
  });

  describe('onSelectChannel', () => {
    it('should dispatch selectChannel when selectedTab is "feed"', () => {
      component.onSelectChannel('c1');
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.selectChannel({ channelId: 'c1' }));
    });

    it('should navigate to channel details when selectedTab is "channels"', () => {
      store.overrideSelector(feedFeature.selectChannelsFilterViewModel, { ...mockVm, selectedTab: 'channels' });
      store.refreshState();
      fixture.detectChanges();

      component.onSelectChannel('c1');

      expect(router.navigate).toHaveBeenCalledWith(['/channels/details', 'c1']);
      expect(store.dispatch).not.toHaveBeenCalledWith(FeedActions.selectChannel({ channelId: 'c1' }));
    });
  });
});
