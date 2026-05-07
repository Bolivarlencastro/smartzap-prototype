import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { SearchClient } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TrailsLeaderApi } from './trails-leader.api';
import { ListFilter } from '../models/list';
import { buildFilter } from '../utils/list-filter.util';

describe('TrailsLeaderApi', () => {
  let service: TrailsLeaderApi;
  let searchClient: jest.Mocked<SearchClient>;

  beforeEach(() => {
    searchClient = { get: jest.fn().mockReturnValue(of(EMPTY)) } as unknown as jest.Mocked<SearchClient>;

    TestBed.configureTestingModule({
      providers: [TrailsLeaderApi, { provide: SearchClient, useValue: searchClient }],
    });

    service = TestBed.inject(TrailsLeaderApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /leaders/trails with the built filter params', () => {
    const filter: ListFilter = { page: 1, per_page: 10 };

    service.getTrails(filter);

    expect(searchClient.get).toHaveBeenCalledWith('/leaders/trails', buildFilter(filter));
  });

  it('should include search param when filter has a search value', () => {
    const filter: ListFilter = { page: 1, per_page: 10, search: 'management' };

    service.getTrails(filter);

    expect(searchClient.get).toHaveBeenCalledWith('/leaders/trails', buildFilter(filter));
  });

  it('should include sort params when filter has a sort with direction', () => {
    const filter: ListFilter = { page: 2, per_page: 5, sort: { active: 'learning_trail_name', direction: 'desc' } };

    service.getTrails(filter);

    expect(searchClient.get).toHaveBeenCalledWith('/leaders/trails', buildFilter(filter));
  });
});
