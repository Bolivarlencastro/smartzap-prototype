import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Clipboard } from '@angular/cdk/clipboard';
import { KonquestAPI } from '@core/api/base';
import { PulseAPI } from '@core/api/pulse.api';
import { SearchAPI } from '@core/api/base/search.api';
import { AuthService, KeepsPathLocationStrategy } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { of } from 'rxjs';
import { PulsesListService } from './pulses-list.service';
import { PulsesListParams, PulsesListResponse } from '../models/params';

describe('PulsesListService', () => {
  let service: PulsesListService;
  let searchApiMock: jest.Mocked<SearchAPI>;
  let pulseApiMock: jest.Mocked<PulseAPI>;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let authServiceMock: jest.Mocked<AuthService>;
  let clipboardMock: jest.Mocked<Clipboard>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let locationStrategyMock: jest.Mocked<KeepsPathLocationStrategy>;
  let documentMock: { location: { origin: string } };

  beforeEach(() => {
    searchApiMock = { get: jest.fn() } as unknown as jest.Mocked<SearchAPI>;
    pulseApiMock = {
      getPulseComments: jest.fn(),
      deletePulseComment: jest.fn(),
      editPulseComment: jest.fn(),
      postPulseComment: jest.fn(),
      postPulseBookmark: jest.fn(),
      deletePulseBookmark: jest.fn(),
    } as unknown as jest.Mocked<PulseAPI>;
    konquestApiMock = {
      delete: jest.fn(),
      post: jest.fn(),
    } as unknown as jest.Mocked<KonquestAPI>;
    authServiceMock = { userId: 'user-123' } as unknown as jest.Mocked<AuthService>;
    clipboardMock = { copy: jest.fn() } as unknown as jest.Mocked<Clipboard>;
    messageServiceMock = { info: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    locationStrategyMock = {
      prepareExternalUrl: jest.fn().mockReturnValue('/external/P/pulse-1'),
    } as unknown as jest.Mocked<KeepsPathLocationStrategy>;
    documentMock = { location: { origin: 'https://example.com' } };

    TestBed.configureTestingModule({
      providers: [
        PulsesListService,
        { provide: SearchAPI, useValue: searchApiMock },
        { provide: PulseAPI, useValue: pulseApiMock },
        { provide: KonquestAPI, useValue: konquestApiMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Clipboard, useValue: clipboardMock },
        { provide: KpMessageService, useValue: messageServiceMock },
        { provide: KeepsPathLocationStrategy, useValue: locationStrategyMock },
        { provide: DOCUMENT, useValue: documentMock },
      ],
    });

    service = TestBed.inject(PulsesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadPulsesList', () => {
    it('should call searchApi.get with the correct path and params', () => {
      const params: PulsesListParams = { channel_id: 'ch-1', cursor: 'cursor-abc' };
      const response: PulsesListResponse = { items: [], next_cursor: null };
      searchApiMock.get.mockReturnValue(of(response) as any);

      let result: any;
      service.loadPulsesList(params).subscribe((res) => (result = res));

      expect(searchApiMock.get).toHaveBeenCalledWith('/v1/pulses/feed', params);
      expect(result).toBe(response);
    });
  });

  describe('loadPulseComments', () => {
    it('should call pulseApi.getPulseComments with ordering and map the result', () => {
      const apiComments = [
        {
          id: 'c1',
          comment: 'Hello',
          pulse: 'p1',
          user: { id: 'u1', name: 'Alice', avatar: 'avatar.png' },
          created_date: '2024-01-01',
        },
      ];
      pulseApiMock.getPulseComments.mockReturnValue(of({ results: apiComments }) as any);

      let result: any;
      service.loadPulseComments('pulse-1').subscribe((res) => (result = res));

      expect(pulseApiMock.getPulseComments).toHaveBeenCalledWith({
        pulse_id: 'pulse-1',
        ordering: '-created_date',
      });
      expect(result).toEqual([
        {
          id: 'c1',
          avatar: 'avatar.png',
          name: 'Alice',
          user_id: 'u1',
          comment: 'Hello',
          created_at: '2024-01-01',
        },
      ]);
    });

    it('should return an empty array when results is undefined', () => {
      pulseApiMock.getPulseComments.mockReturnValue(of({ results: undefined }) as any);

      let result: any;
      service.loadPulseComments('pulse-1').subscribe((res) => (result = res));

      expect(result).toEqual([]);
    });
  });

  describe('deleteComment', () => {
    it('should call pulseApi.deletePulseComment with the given commentId', () => {
      pulseApiMock.deletePulseComment.mockReturnValue(of(undefined) as any);

      service.deleteComment('comment-1').subscribe();

      expect(pulseApiMock.deletePulseComment).toHaveBeenCalledWith('comment-1');
    });
  });

  describe('editComment', () => {
    it('should call pulseApi.editPulseComment with the correct body', () => {
      const mockComment = { id: 'c1', comment: 'Updated' };
      pulseApiMock.editPulseComment.mockReturnValue(of(mockComment) as any);

      let result: any;
      service.editComment('comment-1', 'pulse-1', 'Updated').subscribe((res) => (result = res));

      expect(pulseApiMock.editPulseComment).toHaveBeenCalledWith('comment-1', {
        comment: 'Updated',
        pulse: 'pulse-1',
        user: 'user-123',
      });
      expect(result).toBe(mockComment);
    });
  });

  describe('toggleBookmark', () => {
    it('should delete the bookmark and return { bookmarkId: null } when bookmarkId is provided', () => {
      pulseApiMock.deletePulseBookmark.mockReturnValue(of({}) as any);

      let result: any;
      service.toggleBookmark('pulse-1', 'bookmark-1').subscribe((res) => (result = res));

      expect(pulseApiMock.deletePulseBookmark).toHaveBeenCalledWith('bookmark-1');
      expect(result).toEqual({ bookmarkId: null });
    });

    it('should create a bookmark and return { bookmarkId } when bookmarkId is null', () => {
      pulseApiMock.postPulseBookmark.mockReturnValue(of({ id: 'new-bookmark' }) as any);

      let result: any;
      service.toggleBookmark('pulse-1', null).subscribe((res) => (result = res));

      expect(pulseApiMock.postPulseBookmark).toHaveBeenCalledWith({
        pulse: 'pulse-1',
        user: 'user-123',
      });
      expect(result).toEqual({ bookmarkId: 'new-bookmark' });
    });

    it('should return empty string bookmarkId when the post response has no id', () => {
      pulseApiMock.postPulseBookmark.mockReturnValue(of({}) as any);

      let result: any;
      service.toggleBookmark('pulse-1', null).subscribe((res) => (result = res));

      expect(result).toEqual({ bookmarkId: '' });
    });
  });

  describe('toggleSubscription', () => {
    it('should delete the subscription and return { channelSubscription: null } when channelSubscription is provided', () => {
      konquestApiMock.delete.mockReturnValue(of(undefined) as any);

      let result: any;
      service.toggleSubscription('channel-1', 'sub-1').subscribe((res) => (result = res));

      expect(konquestApiMock.delete).toHaveBeenCalledWith('/channels/subscriptions/sub-1');
      expect(result).toEqual({ channelSubscription: null });
    });

    it('should create a subscription and return { channelSubscription } when channelSubscription is null', () => {
      konquestApiMock.post.mockReturnValue(of({ id: 'new-sub' }) as any);

      let result: any;
      service.toggleSubscription('channel-1', null).subscribe((res) => (result = res));

      expect(konquestApiMock.post).toHaveBeenCalledWith('/channels/subscriptions', {
        channel: 'channel-1',
        user: 'user-123',
      });
      expect(result).toEqual({ channelSubscription: 'new-sub' });
    });

    it('should return empty string channelSubscription when the post response has no id', () => {
      konquestApiMock.post.mockReturnValue(of({}) as any);

      let result: any;
      service.toggleSubscription('channel-1', null).subscribe((res) => (result = res));

      expect(result).toEqual({ channelSubscription: '' });
    });
  });

  describe('ratePulse', () => {
    it('should call konquestApi.post with the correct path and body', () => {
      konquestApiMock.post.mockReturnValue(of(undefined) as any);

      service.ratePulse('pulse-1', 4).subscribe();

      expect(konquestApiMock.post).toHaveBeenCalledWith('/pulses/ratings', {
        pulse: 'pulse-1',
        rating: 4,
        user: 'user-123',
      });
    });
  });

  describe('submitComment', () => {
    it('should call pulseApi.postPulseComment with the correct body', () => {
      const mockComment = { id: 'c1', comment: 'Nice pulse' };
      pulseApiMock.postPulseComment.mockReturnValue(of(mockComment) as any);

      let result: any;
      service.submitComment('pulse-1', 'Nice pulse').subscribe((res) => (result = res));

      expect(pulseApiMock.postPulseComment).toHaveBeenCalledWith({
        pulse: 'pulse-1',
        comment: 'Nice pulse',
        user: 'user-123',
      });
      expect(result).toBe(mockComment);
    });
  });

  describe('copyPulseLink', () => {
    it('should build the external URL and copy it to clipboard', () => {
      service.copyPulseLink('pulse-1');

      expect(locationStrategyMock.prepareExternalUrl).toHaveBeenCalledWith('/P/pulse-1');
      expect(clipboardMock.copy).toHaveBeenCalledWith('https://example.com/external/P/pulse-1');
    });

    it('should show an info message after copying', () => {
      service.copyPulseLink('pulse-1');

      expect(messageServiceMock.info).toHaveBeenCalledWith('PULSES_FEED.PULSE_CARD.COPY_LINK_SUCCESS');
    });
  });
});
