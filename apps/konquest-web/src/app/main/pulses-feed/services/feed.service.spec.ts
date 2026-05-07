import { TestBed } from '@angular/core/testing';
import { SearchAPI } from '@core/api/base/search.api';
import { PulseAPI } from '@core/api/pulse.api';
import { of } from 'rxjs';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let service: FeedService;
  let searchApi: jest.Mocked<SearchAPI>;
  let pulseApi: jest.Mocked<PulseAPI>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedService,
        { provide: SearchAPI, useValue: { get: jest.fn() } },
        { provide: PulseAPI, useValue: { getPulsesTypes: jest.fn() } },
      ],
    });

    service = TestBed.inject(FeedService);
    searchApi = TestBed.inject(SearchAPI) as jest.Mocked<SearchAPI>;
    pulseApi = TestBed.inject(PulseAPI) as jest.Mocked<PulseAPI>;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('loadChannelsFilterCreatedByMe', () => {
    it('should call searchApi.get with correct endpoint and params', () => {
      searchApi.get.mockReturnValue(of({ items: [] }));

      service.loadChannelsFilterCreatedByMe().subscribe();

      expect(searchApi.get).toHaveBeenCalledWith('/v1/channels', { per_page: 999, managed: true });
    });

    it('should map response items to ChannelPulseSideItem[]', (done) => {
      const rawItem = { id: 'ch-1', name: 'Channel 1', cover_image: 'img.png', extra_field: 'should be ignored' };
      searchApi.get.mockReturnValue(of({ items: [rawItem] }));

      service.loadChannelsFilterCreatedByMe().subscribe((result) => {
        expect(result).toEqual([{ id: 'ch-1', name: 'Channel 1', cover_image: 'img.png' }]);
        done();
      });
    });

    it('should return empty array when items is null', (done) => {
      searchApi.get.mockReturnValue(of({ items: null }));

      service.loadChannelsFilterCreatedByMe().subscribe((result) => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('loadChannelsFilterSubscribed', () => {
    it('should call searchApi.get with correct endpoint and params', () => {
      searchApi.get.mockReturnValue(of({ items: [] }));

      service.loadChannelsFilterSubscribed().subscribe();

      expect(searchApi.get).toHaveBeenCalledWith('/v1/channels', { per_page: 999, subscribed: true, active: true });
    });

    it('should map response items to ChannelPulseSideItem[]', (done) => {
      const rawItem = { id: 'ch-2', name: 'Subscribed Channel', cover_image: 'cover.jpg', extra_field: 'ignored' };
      searchApi.get.mockReturnValue(of({ items: [rawItem] }));

      service.loadChannelsFilterSubscribed().subscribe((result) => {
        expect(result).toEqual([{ id: 'ch-2', name: 'Subscribed Channel', cover_image: 'cover.jpg' }]);
        done();
      });
    });

    it('should return empty array when items is null', (done) => {
      searchApi.get.mockReturnValue(of({ items: null }));

      service.loadChannelsFilterSubscribed().subscribe((result) => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('loadPulseTypes', () => {
    it('should call pulseApi.getPulsesTypes()', () => {
      pulseApi.getPulsesTypes.mockReturnValue(of({ results: [] } as any));

      service.loadPulseTypes().subscribe();

      expect(pulseApi.getPulsesTypes).toHaveBeenCalled();
    });

    it('should map results to PulseType[]', (done) => {
      pulseApi.getPulsesTypes.mockReturnValue(of({ results: [{ id: 'type-1', name: 'Video' }] } as any));

      service.loadPulseTypes().subscribe((result) => {
        expect(result).toEqual([{ id: 'type-1', name: 'Video' }]);
        done();
      });
    });

    it('should use empty string fallback when id or name is null', (done) => {
      pulseApi.getPulsesTypes.mockReturnValue(of({ results: [{ id: null, name: null }] } as any));

      service.loadPulseTypes().subscribe((result) => {
        expect(result).toEqual([{ id: '', name: '' }]);
        done();
      });
    });
  });

  describe('loadFavoritePulses', () => {
    it('should call searchApi.get with correct endpoint and params', () => {
      searchApi.get.mockReturnValue(of({ items: [] }));

      service.loadFavoritePulses().subscribe();

      expect(searchApi.get).toHaveBeenCalledWith('/v1/pulses', { per_page: 999, bookmarked: true });
    });

    it('should map response items to ChannelPulseSideItem[]', (done) => {
      const rawItem = { id: 'pulse-1', name: 'My Pulse', cover_image: 'pulse.png', extra_field: 'ignored' };
      searchApi.get.mockReturnValue(of({ items: [rawItem] }));

      service.loadFavoritePulses().subscribe((result) => {
        expect(result).toEqual([{ id: 'pulse-1', name: 'My Pulse', cover_image: 'pulse.png' }]);
        done();
      });
    });

    it('should return empty array when items is null', (done) => {
      searchApi.get.mockReturnValue(of({ items: null }));

      service.loadFavoritePulses().subscribe((result) => {
        expect(result).toEqual([]);
        done();
      });
    });
  });
});
