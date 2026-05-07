import { KeepsLocation } from './keeps-location';
import { KeepsPathLocationStrategy } from './keeps-path-location-strategy';

describe('KeepsLocationService', () => {
  let service: KeepsLocation;
  let locationStrategy: jest.Mocked<KeepsPathLocationStrategy>;

  beforeEach(() => {
    locationStrategy = {
      getBaseHref: jest.fn().mockReturnValue('/custom-baseHref'),
      onPopState: jest.fn(),
    } as unknown as jest.Mocked<KeepsPathLocationStrategy>;

    service = new KeepsLocation(locationStrategy);
  });

  describe('normalize', () => {
    it('should normalize a valid url with the baseHref', () => {
      const expected = '/path/child';

      expect(service.normalize('/custom-baseHref/path/child')).toBe(expected);
    });

    it('should normalize a valid url without the baseHref', () => {
      const expected = '/path/child';

      expect(service.normalize('/path/child')).toBe(expected);
    });

    it('should normalize an non normalized url with the baseHref', () => {
      const expected = '/path/child';

      expect(service.normalize('/custom-baseHref/path/child/')).toBe(expected);
    });

    it('should normalize an non normalized url without the baseHref', () => {
      const expected = '/path/child';

      expect(service.normalize('/path/child/')).toBe(expected);
    });
  });
});
