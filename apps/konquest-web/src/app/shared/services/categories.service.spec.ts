import { TestBed } from '@angular/core/testing';
import { KonquestAPI } from '@core/api';
import { EMPTY, of } from 'rxjs';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpMock: jest.Mocked<KonquestAPI>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: KonquestAPI,
          useValue: { get: jest.fn(() => of(EMPTY)) },
        },
      ],
    });
    httpMock = TestBed.inject(KonquestAPI) as jest.Mocked<KonquestAPI>;
    service = TestBed.inject(CategoriesService);
  });

  it('should fetch missions with only_has_mission parameter and channels categories', () => {
    const mockMissionsResponse = {
      results: [
        { id: 1, name: 'Mission Category 1' },
        { id: 2, name: 'Mission Category 2' },
      ],
    };

    const mockChannelsResponse = {
      results: [
        { id: 1, name: 'Channel Category 1' },
        { id: 2, name: 'Channel Category 2' },
      ],
    };

    httpMock.get.mockImplementation((path: string) => {
      if (path.includes('/missions/categories?only_has_mission=true')) {
        return of(mockMissionsResponse);
      }
      if (path.includes('/channels/categories')) {
        return of(mockChannelsResponse);
      }
      return of(EMPTY);
    });

    service.getCategories().subscribe((categories) => {
      expect(categories.missionsFiltered).toEqual(mockMissionsResponse.results);
      expect(categories.channels).toEqual(mockChannelsResponse.results);
    });

    expect(httpMock.get).toHaveBeenCalledWith('/missions/categories?only_has_mission=true');
    expect(httpMock.get).toHaveBeenCalledWith('/channels/categories');
  });

  it('should fetch all mission categories without parameters', () => {
    const mockAllMissionsResponse = {
      results: [
        { id: 1, name: 'Mission Category 1' },
        { id: 2, name: 'Mission Category 2' },
        { id: 3, name: 'Mission Category 3' },
      ],
    };

    httpMock.get.mockReturnValue(of(mockAllMissionsResponse));

    service.getAllMissionCategories().subscribe((categories) => {
      expect(categories).toEqual(mockAllMissionsResponse.results);
    });

    expect(httpMock.get).toHaveBeenCalledWith('/missions/categories');
  });

  it('should handle empty results from API', () => {
    const emptyResponse = { results: [] };
    httpMock.get.mockReturnValue(of(emptyResponse));

    service.getAllMissionCategories().subscribe((categories) => {
      expect(categories).toEqual([]);
    });

    service.getCategories().subscribe((categories) => {
      expect(categories.missionsFiltered).toEqual([]);
      expect(categories.channels).toEqual([]);
    });
  });

  it('should handle undefined results from API', () => {
    const undefinedResponse = { results: undefined };
    httpMock.get.mockReturnValue(of(undefinedResponse));

    service.getAllMissionCategories().subscribe((categories) => {
      expect(categories).toEqual([]);
    });

    service.getCategories().subscribe((categories) => {
      expect(categories.missionsFiltered).toEqual([]);
      expect(categories.channels).toEqual([]);
    });
  });
});
