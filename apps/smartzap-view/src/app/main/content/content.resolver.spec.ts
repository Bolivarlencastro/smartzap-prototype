import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ContentService } from '@core/services';
import { of, throwError } from 'rxjs';
import { ContentResolver } from './content.resolver';

describe('ContentResolver', () => {
  let resolver: ContentResolver;
  let router: Router;
  let smartzapService: ContentService;

  beforeEach(() => {
    router = {
      navigate: jest.fn(),
    } as unknown as Router;

    smartzapService = {
      fetchContent: jest.fn(),
    } as unknown as ContentService;

    resolver = new ContentResolver(router, smartzapService);
  });

  it('should navigate to not-found if id is not provided', () => {
    const route = {
      params: {},
      queryParamMap: {
        get: jest.fn(),
      },
    } as unknown as ActivatedRouteSnapshot;

    const result = resolver.resolve(route);
    expect(router.navigate).toHaveBeenCalledWith(['/not-found'], { queryParams: undefined });
    expect(result).toBe(null);
  });

  it('should return content when id is provided', () => {
    const mockContent = { id: 1, name: 'Content' };
    smartzapService.fetchContent = jest.fn().mockReturnValue(of(mockContent));

    const route = {
      params: { id: 1 },
      queryParamMap: {
        get: jest.fn().mockReturnValue('12345'),
      },
    } as unknown as ActivatedRouteSnapshot;

    const result = resolver.resolve(route);
    result.subscribe((data) => {
      expect(data).toEqual(mockContent);
    });
    expect(smartzapService.fetchContent).toHaveBeenCalledWith(1);
  });

  it('should handle error and navigate to not-found', (done) => {
    smartzapService.fetchContent = jest.fn().mockReturnValue(throwError(() => new Error('error')));

    const route = {
      params: { id: 1 },
      queryParamMap: {
        get: jest.fn().mockReturnValue('12345'),
      },
    } as unknown as ActivatedRouteSnapshot;

    const result = resolver.resolve(route);
    result.subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(router.navigate).toHaveBeenCalledWith(['/not-found'], { queryParams: { phone: '12345' } });
        expect(error.message).toBe('error');
        done();
      },
    });
  });
});
