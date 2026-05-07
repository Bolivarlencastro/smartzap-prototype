jest.mock('emoji-picker-element', () => ({}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Signal } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { FeedTabsComponent } from './feed-tabs.component';
import { FeedActions, feedFeature } from '../../store';

type FeedTabsProtected = { selectedTab: Signal<string | undefined>; feedLayout: Signal<string | undefined> };

describe('FeedTabsComponent', () => {
  let component: FeedTabsComponent;
  let fixture: ComponentFixture<FeedTabsComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedTabsComponent, getTranslocoTestingModule()],
      providers: [provideMockStore()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(feedFeature.selectSelectedTab, 'feed');
    store.overrideSelector(feedFeature.selectFeedLayout, 'list');
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onSelectTab', () => {
    it('should dispatch setTab with "feed"', () => {
      component.onSelectTab('feed');
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setTab({ tab: 'feed' }));
    });

    it('should dispatch setTab with "channels"', () => {
      component.onSelectTab('channels');
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setTab({ tab: 'channels' }));
    });
  });

  describe('onSelectLayout', () => {
    it('should dispatch setFeedLayout with "list"', () => {
      component.onSelectLayout('list');
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setFeedLayout({ layout: 'list' }));
    });

    it('should dispatch setFeedLayout with "grid"', () => {
      component.onSelectLayout('grid');
      expect(store.dispatch).toHaveBeenCalledWith(FeedActions.setFeedLayout({ layout: 'grid' }));
    });
  });

  describe('selectedTab signal', () => {
    it('should reflect the selected tab from the store', () => {
      expect((fixture.componentInstance as unknown as FeedTabsProtected).selectedTab()).toBe('feed');
    });

    it('should reflect channels tab when selector changes', () => {
      store.overrideSelector(feedFeature.selectSelectedTab, 'channels');
      store.refreshState();
      fixture.detectChanges();

      expect((fixture.componentInstance as unknown as FeedTabsProtected).selectedTab()).toBe('channels');
    });
  });

  describe('feedLayout signal', () => {
    it('should reflect the layout from the store', () => {
      expect((fixture.componentInstance as unknown as FeedTabsProtected).feedLayout()).toBe('list');
    });

    it('should reflect grid layout when selector changes', () => {
      store.overrideSelector(feedFeature.selectFeedLayout, 'grid');
      store.refreshState();
      fixture.detectChanges();

      expect((fixture.componentInstance as unknown as FeedTabsProtected).feedLayout()).toBe('grid');
    });
  });
});
