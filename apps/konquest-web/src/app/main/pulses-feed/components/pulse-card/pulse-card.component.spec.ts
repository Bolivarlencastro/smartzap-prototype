jest.mock('emoji-picker-element', () => ({}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { PulseCardComponent } from './pulse-card.component';
import { Pulse } from '../../models/pulse';
import { PulseChannelActions, PulsesListActions } from '../../store';
import { PulseCommentsComponent } from '../pulse-comments/pulse-comments.component';

const mockPulse: Pulse = {
  id: 'pulse-1',
  name: 'Test Pulse',
  description: 'Test description for the pulse',
  cover_image: 'https://assets.keepsdev.com/images/placeholders/v2/pulse.png',
  channel_id: 'ch-1',
  channel_name: 'Test Channel',
  channel_subscription_id: 'sub-123',
  created_date: new Date('2026-01-01T10:00:00.000Z').toISOString(),
  creator_name: 'Alice Johnson',
  pulse_type: { id: 'video', name: 'Video' },
  bookmark_id: '',
  is_active: true,
  duration: 300,
  comments_count: 0,
  comments: [],
};

describe('PulseCardComponent', () => {
  let component: PulseCardComponent;
  let fixture: ComponentFixture<PulseCardComponent>;
  let store: MockStore;
  let router: { navigateByUrl: jest.Mock; navigate: jest.Mock };

  beforeEach(async () => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));

    router = { navigateByUrl: jest.fn(), navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [PulseCardComponent, getTranslocoTestingModule()],
      providers: [provideMockStore(), { provide: Router, useValue: router }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    TestBed.overrideComponent(PulseCardComponent, {
      remove: { imports: [PulseCommentsComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pulse', mockPulse);
    fixture.detectChanges();
  });

  describe('isBookmarked', () => {
    it('should be false when bookmark_id is empty', () => {
      expect(component.isBookmarked()).toBe(false);
    });

    it('should be true when bookmark_id is set', () => {
      fixture.componentRef.setInput('pulse', { ...mockPulse, bookmark_id: 'bm-123' });
      expect(component.isBookmarked()).toBe(true);
    });
  });

  describe('isSubscribed', () => {
    it('should be true when channel_subscription_id is set', () => {
      expect(component.isSubscribed()).toBe(true);
    });

    it('should be false when channel_subscription_id is empty', () => {
      fixture.componentRef.setInput('pulse', { ...mockPulse, channel_subscription_id: '' });
      expect(component.isSubscribed()).toBe(false);
    });
  });

  describe('openDetail', () => {
    it('should dispatch openedFromFeed and navigate to the pulse detail route', () => {
      component.openDetail();
      expect(store.dispatch).toHaveBeenCalledWith(PulsesListActions.openedFromFeed());
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/P/${mockPulse.id}`);
    });
  });

  describe('toggleBookmark', () => {
    it('should dispatch toggleBookmark with null bookmarkId when bookmark_id is empty', () => {
      component.toggleBookmark();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleBookmark({ pulseId: mockPulse.id, bookmarkId: null }),
      );
    });

    it('should dispatch toggleBookmark with existing bookmarkId when already bookmarked', () => {
      fixture.componentRef.setInput('pulse', { ...mockPulse, bookmark_id: 'bm-456' });
      component.toggleBookmark();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleBookmark({ pulseId: mockPulse.id, bookmarkId: 'bm-456' }),
      );
    });
  });

  describe('toggleSubscription', () => {
    it('should dispatch toggleSubscription with current channel_subscription_id', () => {
      component.toggleSubscription();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleSubscription({
          pulseId: mockPulse.id,
          channelId: mockPulse.channel_id,
          channelSubscription: mockPulse.channel_subscription_id,
          channel: { id: mockPulse.channel_id, name: mockPulse.channel_name, cover_image: '' },
        }),
      );
    });

    it('should dispatch toggleSubscription with null when channel_subscription_id is empty', () => {
      fixture.componentRef.setInput('pulse', { ...mockPulse, channel_subscription_id: '' });
      component.toggleSubscription();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleSubscription({
          pulseId: mockPulse.id,
          channelId: mockPulse.channel_id,
          channelSubscription: null,
          channel: { id: mockPulse.channel_id, name: mockPulse.channel_name, cover_image: '' },
        }),
      );
    });
  });

  describe('copyLink', () => {
    it('should dispatch copyPulseLink with the pulse id', () => {
      component.copyLink();
      expect(store.dispatch).toHaveBeenCalledWith(PulseChannelActions.copyPulseLink({ pulseId: mockPulse.id }));
    });
  });

  describe('setRating', () => {
    it('should dispatch ratePulse with rating 3', () => {
      component.setRating(3);
      expect(store.dispatch).toHaveBeenCalledWith(PulseChannelActions.ratePulse({ pulseId: mockPulse.id, rating: 3 }));
    });

    it('should dispatch ratePulse with rating 5', () => {
      component.setRating(5);
      expect(store.dispatch).toHaveBeenCalledWith(PulseChannelActions.ratePulse({ pulseId: mockPulse.id, rating: 5 }));
    });
  });
});
