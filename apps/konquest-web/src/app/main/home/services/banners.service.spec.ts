import { Router } from '@angular/router';
import { KonquestAPI } from '@core/api';
import { EMPTY, of } from 'rxjs';
import { BannerActionData, BannerModel } from '../models/banners';
import { BannersService } from './banners.service';

describe('BannersService', () => {
  let service: BannersService;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    konquestApiMock = {
      get: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<KonquestAPI>;

    routerMock = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    service = new BannersService(konquestApiMock, routerMock);
  });

  describe('redirectTo', () => {
    it('should navigate to course for continue action', () => {
      const data: BannerActionData = { action: 'continue', item: { id: '1' } as BannerModel };

      service.redirectTo(data);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/course', '1']);
    });

    it('should navigate to course for start action', () => {
      const data: BannerActionData = { action: 'start', item: { id: '1' } as BannerModel };

      service.redirectTo(data);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/course', '1']);
    });
  });

  describe('showDetails', () => {
    it('should navigate to mission for COURSE resource type', () => {
      const item = { id: '1', resource_type: 'COURSE' } as BannerModel;

      service.showDetails(item);

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/C/1');
    });

    it('should navigate to event for EVENT resource type', () => {
      const item = { id: '1', resource_type: 'EVENT' } as BannerModel;

      service.showDetails(item);

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/E/1');
    });

    it('should navigate to trail for TRAIL resource type', () => {
      const item = { id: '1', resource_type: 'LEARNING_TRAIL' } as BannerModel;

      service.showDetails(item);

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/T/1');
    });
  });
});
