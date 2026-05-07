jest.mock('emoji-picker-element', () => ({}));
jest.mock('../../utils/description-truncation.util', () => ({
  initDescriptionTruncation: jest.fn(),
}));
jest.mock('../../utils/emoji-picker.util', () => ({
  initEmojiPicker: jest.fn(),
}));

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { PulseService } from '@core/api';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { PulseDetailsActions, PulseChannelActions, PulsesListActions } from '../../store';
import { pulsesListFeature } from '../../store/pulses-list/pulses-list.feature';
import { pulseDetailsFeature } from '../../store/pulse-details/pulse-details.feature';
import { ChannelDetailsApiResponse, PulseDetailsApiComment, PulseDetailsApiResponse } from '../../models/pulse-details';
import { KpViewerKonquestComponent } from 'app/shared/components/kp-components/kp-viewers/kp-viewer/kp-viewer-konquest.component';
import { PulseFeedQuizComponent } from '../../components/pulse-feed-quiz/pulse-feed-quiz.component';
import { PulseDetailsCommentsComponent } from '../../components/pulse-details-comments/pulse-details-comments.component';
import { PulseDetailsComponent } from './pulse-details.component';

const mockPulse: PulseDetailsApiResponse = {
  id: 'pulse-1',
  name: 'Test Pulse',
  description: 'Test description',
  learn_content_uuid: 'content-uuid-1',
  created_date: '2025-01-01T10:00:00Z',
  updated_date: '2025-01-01T10:00:00Z',
  user_creator: { id: 'user-1', name: 'Alice' } as any,
  pulse_type: { id: 'video', name: 'Video' },
  duration_time: 300,
  language: 'en',
  status: 'active',
  bookmark_id: '',
  channels: [{ id: 'channel-1', name: 'Test Channel', category: 'cat1' }],
};

const mockChannel: ChannelDetailsApiResponse = {
  id: 'channel-1',
  name: 'Test Channel',
  is_owner: false,
  is_contributor: false,
  subscription: undefined,
  holder_image: 'channel-image.png',
};

const mockUser = { id: 'user-2', name: 'Bob' };

describe('PulseDetailsComponent', () => {
  let component: PulseDetailsComponent;
  let fixture: ComponentFixture<PulseDetailsComponent>;
  let store: MockStore;

  const breakpointSubject = new BehaviorSubject<{ matches: boolean }>({ matches: false });
  const mockBreakpointObserver = {
    observe: jest.fn(() => breakpointSubject.asObservable()),
    isMatched: jest.fn().mockReturnValue(false),
  };
  const mockPulseService = { isQuiz: jest.fn().mockReturnValue(false) };
  const mockUserProfileService = { profile$: of(mockUser) };

  const setupStore = () => {
    store.overrideSelector(pulseDetailsFeature.selectPulse, mockPulse);
    store.overrideSelector(pulseDetailsFeature.selectComments, []);
    store.overrideSelector(pulseDetailsFeature.selectChannel, mockChannel);
    store.overrideSelector(pulseDetailsFeature.selectLoading, false);
    store.overrideSelector(pulseDetailsFeature.selectContent, null);
    store.overrideSelector(pulseDetailsFeature.selectPulseId, 'pulse-1');
    store.overrideSelector(pulsesListFeature.selectOpenedFromFeed, false);
    store.overrideSelector(pulsesListFeature.selectAll, []);
  };

  beforeEach(async () => {
    mockPulseService.isQuiz.mockReturnValue(false);
    mockBreakpointObserver.isMatched.mockReturnValue(false);
    breakpointSubject.next({ matches: false });

    await TestBed.configureTestingModule({
      imports: [PulseDetailsComponent, getTranslocoTestingModule()],
      providers: [
        provideNoopAnimations(),
        provideMockStore(),
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: PulseService, useValue: mockPulseService },
        { provide: UserProfileService, useValue: mockUserProfileService },
        {
          provide: MatDialogRef,
          useValue: { afterOpened: jest.fn().mockReturnValue(of(undefined)), close: jest.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    TestBed.overrideComponent(PulseDetailsComponent, {
      remove: { imports: [KpViewerKonquestComponent, PulseFeedQuizComponent, PulseDetailsCommentsComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    store = TestBed.inject(MockStore);
    setupStore();
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleInfo', () => {
    it('should start as true', () => {
      expect(component.infoOpen()).toBe(true);
    });

    it('should toggle infoOpen from true to false', () => {
      component.toggleInfo();
      expect(component.infoOpen()).toBe(false);
    });

    it('should toggle infoOpen back to true on second call', () => {
      component.toggleInfo();
      component.toggleInfo();
      expect(component.infoOpen()).toBe(true);
    });
  });

  describe('setRating', () => {
    it('should dispatch ratePulse with the pulseId and rating', () => {
      component.setRating(3);
      expect(store.dispatch).toHaveBeenCalledWith(PulseChannelActions.ratePulse({ pulseId: 'pulse-1', rating: 3 }));
    });

    it('should not dispatch when pulseId is null', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulseId, null as any);
      store.refreshState();
      component.setRating(3);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('toggleBookmark', () => {
    it('should dispatch toggleBookmark with empty string bookmarkId when bookmark_id is empty', () => {
      component.toggleBookmark();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleBookmark({ pulseId: 'pulse-1', bookmarkId: '' }),
      );
    });

    it('should dispatch toggleBookmark with existing bookmarkId when already bookmarked', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, { ...mockPulse, bookmark_id: 'bm-123' });
      store.refreshState();
      component.toggleBookmark();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleBookmark({ pulseId: 'pulse-1', bookmarkId: 'bm-123' }),
      );
    });

    it('should dispatch toggleBookmark with null bookmarkId when bookmark_id is undefined', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, { ...mockPulse, bookmark_id: undefined });
      store.refreshState();
      component.toggleBookmark();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleBookmark({ pulseId: 'pulse-1', bookmarkId: null }),
      );
    });

    it('should not dispatch when pulse is null', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, null);
      store.refreshState();
      component.toggleBookmark();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('toggleSubscription', () => {
    it('should dispatch toggleSubscription with null channelSubscription when not subscribed', () => {
      component.toggleSubscription();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleSubscription({
          pulseId: 'pulse-1',
          channelId: 'channel-1',
          channelSubscription: null,
          channel: {
            id: 'channel-1',
            name: 'Test Channel',
            cover_image: 'channel-image.png',
          },
        }),
      );
    });

    it('should dispatch toggleSubscription with subscription id when subscribed', () => {
      store.overrideSelector(pulseDetailsFeature.selectChannel, {
        ...mockChannel,
        subscription: { id: 'sub-1', active_subscription: true },
      });
      store.refreshState();
      component.toggleSubscription();
      expect(store.dispatch).toHaveBeenCalledWith(
        PulseChannelActions.toggleSubscription({
          pulseId: 'pulse-1',
          channelId: 'channel-1',
          channelSubscription: 'sub-1',
          channel: expect.objectContaining({ id: 'channel-1' }),
        }),
      );
    });

    it('should not dispatch when pulse is null', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, null);
      store.refreshState();
      component.toggleSubscription();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when pulse has no channels', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, { ...mockPulse, channels: [] });
      store.refreshState();
      component.toggleSubscription();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('copyLink', () => {
    it('should dispatch copyPulseLink with the pulse id', () => {
      component.copyLink();
      expect(store.dispatch).toHaveBeenCalledWith(PulseChannelActions.copyPulseLink({ pulseId: 'pulse-1' }));
    });

    it('should not dispatch when pulse is null', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, null);
      store.refreshState();
      component.copyLink();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch dialogDestroy action', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(PulseDetailsActions.dialogDestroy());
    });
  });

  describe('isBookmarked', () => {
    it('should be false when bookmark_id is empty', () => {
      expect(component.isBookmarked()).toBe(false);
    });

    it('should be true when bookmark_id is set', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, { ...mockPulse, bookmark_id: 'bm-123' });
      store.refreshState();
      expect(component.isBookmarked()).toBe(true);
    });
  });

  describe('isSubscribed', () => {
    it('should be false when channel has no subscription', () => {
      expect(component.isSubscribed()).toBe(false);
    });

    it('should be true when channel has a subscription', () => {
      store.overrideSelector(pulseDetailsFeature.selectChannel, {
        ...mockChannel,
        subscription: { id: 'sub-1', active_subscription: true },
      });
      store.refreshState();
      expect(component.isSubscribed()).toBe(true);
    });
  });

  describe('disableActivityEvents', () => {
    it('should be false when user is not owner, contributor, or pulse creator', () => {
      expect(component.disableActivityEvents()).toBe(false);
    });

    it('should be true when channel is_owner is true', () => {
      store.overrideSelector(pulseDetailsFeature.selectChannel, { ...mockChannel, is_owner: true });
      store.refreshState();
      expect(component.disableActivityEvents()).toBe(true);
    });

    it('should be true when channel is_contributor is true', () => {
      store.overrideSelector(pulseDetailsFeature.selectChannel, { ...mockChannel, is_contributor: true });
      store.refreshState();
      expect(component.disableActivityEvents()).toBe(true);
    });

    it('should be true when pulse creator is the current user', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, {
        ...mockPulse,
        user_creator: { id: 'user-2', name: 'Bob' } as any,
      });
      store.refreshState();
      expect(component.disableActivityEvents()).toBe(true);
    });
  });

  describe('isQuiz', () => {
    it('should return false when pulseService.isQuiz returns false', () => {
      expect(component.isQuiz()).toBe(false);
    });

    it('should return true when pulseService.isQuiz returns true', () => {
      mockPulseService.isQuiz.mockReturnValue(true);
      store.overrideSelector(pulseDetailsFeature.selectPulse, {
        ...mockPulse,
        pulse_type: { id: 'quiz', name: 'Quiz' },
      });
      store.refreshState();
      expect(component.isQuiz()).toBe(true);
    });
  });

  describe('contentUrl', () => {
    it('should return empty string when content is null', () => {
      expect(component.contentUrl()).toBe('');
    });

    it('should return the content url when content is set', () => {
      store.overrideSelector(pulseDetailsFeature.selectContent, { url: 'https://example.com/video.mp4' } as any);
      store.refreshState();
      expect(component.contentUrl()).toBe('https://example.com/video.mp4');
    });
  });

  describe('contentType', () => {
    it('should return undefined when content is null', () => {
      expect(component.contentType()).toBeUndefined();
    });

    it('should return the content type name when content is set', () => {
      store.overrideSelector(pulseDetailsFeature.selectContent, {
        url: 'https://example.com/video.mp4',
        content_type: { name: 'video' },
      } as any);
      store.refreshState();
      expect(component.contentType()).toBe('video');
    });
  });

  describe('relativeTime', () => {
    it('should return null when pulse is null', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulse, null);
      store.refreshState();
      expect(component.relativeTime()).toBeNull();
    });

    it('should return a string when pulse has a created_date', () => {
      expect(typeof component.relativeTime()).toBe('string');
    });
  });

  describe('outerClass (desktop)', () => {
    it('should return desktop grid-cols-12 class', () => {
      expect(component.outerClass()).toContain('grid-cols-12');
      expect(component.outerClass()).not.toContain('grid-rows-2');
    });
  });

  describe('contentAreaClass (desktop)', () => {
    it('should return col-span-8 when infoOpen is true and not a quiz', () => {
      expect(component.contentAreaClass()).toContain('col-span-8');
    });

    it('should return col-span-12 when infoOpen is false and not a quiz', () => {
      component.toggleInfo();
      expect(component.contentAreaClass()).toContain('col-span-12');
    });

    it('should return col-span-12 when pulse is a quiz', () => {
      mockPulseService.isQuiz.mockReturnValue(true);
      store.overrideSelector(pulseDetailsFeature.selectPulse, {
        ...mockPulse,
        pulse_type: { id: 'quiz', name: 'Quiz' },
      });
      store.refreshState();
      expect(component.contentAreaClass()).toContain('col-span-12');
    });
  });

  describe('infoPanelClass (desktop)', () => {
    it('should return col-span-4 class', () => {
      expect(component.infoPanelClass()).toContain('col-span-4');
    });
  });

  describe('outerClass (mobile)', () => {
    let mobileComponent: PulseDetailsComponent;
    let mobileFixture: ComponentFixture<PulseDetailsComponent>;

    beforeEach(() => {
      mockBreakpointObserver.isMatched.mockReturnValue(true);
      breakpointSubject.next({ matches: true });

      mobileFixture = TestBed.createComponent(PulseDetailsComponent);
      mobileComponent = mobileFixture.componentInstance;
      mobileFixture.detectChanges();
    });

    afterEach(() => {
      mobileFixture.destroy();
    });

    it('should return grid-rows-2 class', () => {
      expect(mobileComponent.outerClass()).toContain('grid-rows-2');
      expect(mobileComponent.outerClass()).not.toContain('grid-cols-12');
    });
  });

  describe('infoPanelClass (mobile)', () => {
    let mobileComponent: PulseDetailsComponent;
    let mobileFixture: ComponentFixture<PulseDetailsComponent>;

    beforeEach(() => {
      mockBreakpointObserver.isMatched.mockReturnValue(true);
      breakpointSubject.next({ matches: true });

      mobileFixture = TestBed.createComponent(PulseDetailsComponent);
      mobileComponent = mobileFixture.componentInstance;
      mobileFixture.detectChanges();
    });

    afterEach(() => {
      mobileFixture.destroy();
    });

    it('should return row-span-1 class', () => {
      expect(mobileComponent.infoPanelClass()).toContain('row-span-1');
    });
  });

  describe('commentText', () => {
    it('should start as empty string', () => {
      expect(component.commentText()).toBe('');
    });

    it('should update when set', () => {
      component.commentText.set('hello');
      expect(component.commentText()).toBe('hello');
    });
  });

  describe('canPublish', () => {
    it('should be false when commentText is empty', () => {
      expect(component.canPublish()).toBe(false);
    });

    it('should be false when commentText is only whitespace', () => {
      component.commentText.set('   ');
      expect(component.canPublish()).toBe(false);
    });

    it('should be true when commentText has content', () => {
      component.commentText.set('Great pulse!');
      expect(component.canPublish()).toBe(true);
    });

    it('should be false when commentText exceeds 500 characters', () => {
      component.commentText.set('a'.repeat(501));
      expect(component.canPublish()).toBe(false);
    });
  });

  describe('charCount', () => {
    it('should return 0 when commentText is empty', () => {
      expect(component.charCount()).toBe(0);
    });

    it('should return the length of commentText', () => {
      component.commentText.set('hello');
      expect(component.charCount()).toBe(5);
    });
  });

  describe('isOverLimit', () => {
    it('should be false when text is within the 500-character limit', () => {
      component.commentText.set('hello');
      expect(component.isOverLimit()).toBe(false);
    });

    it('should be false when text is exactly 500 characters', () => {
      component.commentText.set('a'.repeat(500));
      expect(component.isOverLimit()).toBe(false);
    });

    it('should be true when text exceeds 500 characters', () => {
      component.commentText.set('a'.repeat(501));
      expect(component.isOverLimit()).toBe(true);
    });
  });

  describe('publish', () => {
    it('should not dispatch when commentText is empty', () => {
      component.publish();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when commentText is only whitespace', () => {
      component.commentText.set('   ');
      component.publish();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch submitComment with trimmed text and a displayComment', () => {
      component.commentText.set('  Great pulse!  ');
      component.publish();

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Great pulse!',
          displayComment: expect.objectContaining<Partial<PulseDetailsApiComment>>({
            comment: 'Great pulse!',
            user: expect.objectContaining({ id: 'user-2', name: 'Bob' }),
          }),
        }),
      );
    });

    it('should reset commentText to empty string after dispatching', () => {
      component.commentText.set('A comment');
      component.publish();
      expect(component.commentText()).toBe('');
    });
  });

  describe('hasNavigation', () => {
    it('should be false by default', () => {
      expect(component.hasNavigation()).toBe(false);
    });

    it('should be true when openedFromFeed is true', () => {
      store.overrideSelector(pulsesListFeature.selectOpenedFromFeed, true);
      store.refreshState();
      expect(component.hasNavigation()).toBe(true);
    });
  });

  describe('navigation computed signals', () => {
    const pulseA = { ...mockPulse, id: 'pulse-A' };
    const pulseB = { ...mockPulse, id: 'pulse-1' };
    const pulseC = { ...mockPulse, id: 'pulse-C' };

    beforeEach(() => {
      store.overrideSelector(pulsesListFeature.selectAll, [pulseA, pulseB, pulseC]);
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'pulse-1');
      store.refreshState();
    });

    it('currentIndex should return the index of the current pulse', () => {
      expect(component.currentIndex()).toBe(1);
    });

    it('hasPrev should be true when there is a previous pulse', () => {
      expect(component.hasPrev()).toBe(true);
    });

    it('hasNext should be true when there is a next pulse', () => {
      expect(component.hasNext()).toBe(true);
    });

    it('hasPrev should be false when current is the first pulse', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'pulse-A');
      store.refreshState();
      expect(component.hasPrev()).toBe(false);
    });

    it('hasNext should be false when current is the last pulse', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'pulse-C');
      store.refreshState();
      expect(component.hasNext()).toBe(false);
    });

    it('currentIndex should return -1 when pulse is not in the list', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'unknown-id');
      store.refreshState();
      expect(component.currentIndex()).toBe(-1);
    });
  });

  describe('navigatePrev', () => {
    beforeEach(() => {
      store.overrideSelector(pulsesListFeature.selectAll, [
        { ...mockPulse, id: 'pulse-A' },
        { ...mockPulse, id: 'pulse-1' },
      ]);
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'pulse-1');
      store.refreshState();
    });

    it('should dispatch openPulseDetails with the previous pulse id', () => {
      component.navigatePrev();
      expect(store.dispatch).toHaveBeenCalledWith(PulseDetailsActions.openPulseDetails({ pulseId: 'pulse-A' }));
    });

    it('should not dispatch when already at the first pulse', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'pulse-A');
      store.refreshState();
      component.navigatePrev();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('navigateNext', () => {
    beforeEach(() => {
      store.overrideSelector(pulsesListFeature.selectAll, [
        { ...mockPulse, id: 'pulse-1' },
        { ...mockPulse, id: 'pulse-B' },
      ]);
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'pulse-1');
      store.refreshState();
    });

    it('should dispatch openPulseDetails with the next pulse id', () => {
      component.navigateNext();
      expect(store.dispatch).toHaveBeenCalledWith(PulseDetailsActions.openPulseDetails({ pulseId: 'pulse-B' }));
    });

    it('should not dispatch when already at the last pulse', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'pulse-B');
      store.refreshState();
      component.navigateNext();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when pulseId is not in the list', () => {
      store.overrideSelector(pulseDetailsFeature.selectPulseId, 'unknown-id');
      store.refreshState();
      component.navigateNext();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('contentAreaClass (mobile)', () => {
    let mobileComponent: PulseDetailsComponent;
    let mobileFixture: ComponentFixture<PulseDetailsComponent>;

    beforeEach(() => {
      mockBreakpointObserver.isMatched.mockReturnValue(true);
      breakpointSubject.next({ matches: true });

      mobileFixture = TestBed.createComponent(PulseDetailsComponent);
      mobileComponent = mobileFixture.componentInstance;
      mobileFixture.detectChanges();
    });

    afterEach(() => {
      mobileFixture.destroy();
    });

    it('should return row-span-1 when infoOpen is true and not a quiz', () => {
      expect(mobileComponent.contentAreaClass()).toContain('row-span-1');
    });

    it('should return row-span-2 when infoOpen is false and not a quiz', () => {
      mobileComponent.toggleInfo();
      expect(mobileComponent.contentAreaClass()).toContain('row-span-2');
    });

    it('should return row-span-2 when pulse is a quiz', () => {
      mockPulseService.isQuiz.mockReturnValue(true);
      store.overrideSelector(pulseDetailsFeature.selectPulse, {
        ...mockPulse,
        pulse_type: { id: 'quiz', name: 'Quiz' },
      });
      store.refreshState();
      expect(mobileComponent.contentAreaClass()).toContain('row-span-2');
    });
  });
});
