import { TestBed } from '@angular/core/testing';
import { KonquestAPI } from '@core/api/base';
import { SearchAPI } from '@core/api/base/search.api';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { ChannelsListParams } from '../models/params';
import { ChannelsListService } from './channels-list.service';

describe('ChannelsListService', () => {
  let service: ChannelsListService;
  let searchApiMock: jest.Mocked<SearchAPI>;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(() => {
    searchApiMock = { get: jest.fn() } as unknown as jest.Mocked<SearchAPI>;
    konquestApiMock = {
      delete: jest.fn(),
      post: jest.fn(),
    } as unknown as jest.Mocked<KonquestAPI>;
    authServiceMock = { userId: 'user-123' } as unknown as jest.Mocked<AuthService>;

    TestBed.configureTestingModule({
      providers: [
        ChannelsListService,
        { provide: SearchAPI, useValue: searchApiMock },
        { provide: KonquestAPI, useValue: konquestApiMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(ChannelsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadChannelsList', () => {
    it('should call searchApi.get with the correct path and params', () => {
      const params: ChannelsListParams = { page: 1, per_page: 10 };
      const response = { results: [], count: 0 };
      searchApiMock.get.mockReturnValue(of(response) as any);

      let result: any;
      service.loadChannelsList(params).subscribe((res) => (result = res));

      expect(searchApiMock.get).toHaveBeenCalledWith('/v1/channels', params);
      expect(result).toBe(response);
    });

    it('should forward optional filter params to searchApi.get', () => {
      const params: ChannelsListParams = {
        page: 2,
        per_page: 5,
        subscribed: true,
        language: ['en', 'pt-BR'],
        active: true,
      };
      searchApiMock.get.mockReturnValue(of({ results: [], count: 0 }) as any);

      service.loadChannelsList(params).subscribe();

      expect(searchApiMock.get).toHaveBeenCalledWith('/v1/channels', params);
    });
  });

  describe('toggleSubscription', () => {
    describe('when subscriptionId is provided', () => {
      it('should call konquestApi.delete with the correct endpoint', () => {
        konquestApiMock.delete.mockReturnValue(of(undefined) as any);

        service.toggleSubscription('channel-1', 'sub-1').subscribe();

        expect(konquestApiMock.delete).toHaveBeenCalledWith('/channels/subscriptions/sub-1');
      });

      it('should return { subscriptionId: null }', () => {
        konquestApiMock.delete.mockReturnValue(of(undefined) as any);

        let result: any;
        service.toggleSubscription('channel-1', 'sub-1').subscribe((res) => (result = res));

        expect(result).toEqual({ subscriptionId: null });
      });

      it('should not call konquestApi.post', () => {
        konquestApiMock.delete.mockReturnValue(of(undefined) as any);

        service.toggleSubscription('channel-1', 'sub-1').subscribe();

        expect(konquestApiMock.post).not.toHaveBeenCalled();
      });
    });

    describe('when subscriptionId is null', () => {
      it('should call konquestApi.post with channel and user', () => {
        konquestApiMock.post.mockReturnValue(of({ id: 'new-sub' }) as any);

        service.toggleSubscription('channel-1', null).subscribe();

        expect(konquestApiMock.post).toHaveBeenCalledWith('/channels/subscriptions', {
          channel: 'channel-1',
          user: 'user-123',
        });
      });

      it('should return { subscriptionId } from the response id', () => {
        konquestApiMock.post.mockReturnValue(of({ id: 'new-sub' }) as any);

        let result: any;
        service.toggleSubscription('channel-1', null).subscribe((res) => (result = res));

        expect(result).toEqual({ subscriptionId: 'new-sub' });
      });

      it('should return { subscriptionId: "" } when response has no id', () => {
        konquestApiMock.post.mockReturnValue(of({}) as any);

        let result: any;
        service.toggleSubscription('channel-1', null).subscribe((res) => (result = res));

        expect(result).toEqual({ subscriptionId: '' });
      });

      it('should not call konquestApi.delete', () => {
        konquestApiMock.post.mockReturnValue(of({ id: 'new-sub' }) as any);

        service.toggleSubscription('channel-1', null).subscribe();

        expect(konquestApiMock.delete).not.toHaveBeenCalled();
      });
    });
  });
});
