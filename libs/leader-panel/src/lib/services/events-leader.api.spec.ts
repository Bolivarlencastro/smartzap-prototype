import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { SearchClient } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EventsLeaderApi } from './events-leader.api';
import { ListFilter } from '../models/list';
import { buildFilter } from '../utils/list-filter.util';

describe('EventsLeaderApi', () => {
  let service: EventsLeaderApi;
  let searchClient: jest.Mocked<SearchClient>;

  beforeEach(() => {
    searchClient = { get: jest.fn().mockReturnValue(of(EMPTY)) } as unknown as jest.Mocked<SearchClient>;

    TestBed.configureTestingModule({
      providers: [EventsLeaderApi, { provide: SearchClient, useValue: searchClient }],
    });

    service = TestBed.inject(EventsLeaderApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /leaders/events with the built filter params', () => {
    const filter: ListFilter = { page: 1, per_page: 10 };

    service.getEvents(filter);

    expect(searchClient.get).toHaveBeenCalledWith('/leaders/events', buildFilter(filter));
  });

  it('should include search param when filter has a search value', () => {
    const filter: ListFilter = { page: 1, per_page: 10, search: 'workshop' };

    service.getEvents(filter);

    expect(searchClient.get).toHaveBeenCalledWith('/leaders/events', buildFilter(filter));
  });

  it('should include sort params when filter has a sort with direction', () => {
    const filter: ListFilter = { page: 2, per_page: 5, sort: { active: 'event_name', direction: 'asc' } };

    service.getEvents(filter);

    expect(searchClient.get).toHaveBeenCalledWith('/leaders/events', buildFilter(filter));
  });
});
