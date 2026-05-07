import { URLService } from './url.service';

describe('URLService', () => {
  let service: URLService;

  beforeEach(() => {
    service = new URLService();
  });

  describe('isSoundCloudUrl', () => {
    const cases: any[] = [
      ['https://soundcloud.com/artist/track', true],
      ['https://example.com/artist/track', false],
      ['', false],
      [undefined, false],
    ];

    test.each(cases)('should return the correct value when url is %p', (url, expectedValue) => {
      expect(service.isSoundCloudUrl(url)).toBe(expectedValue);
    });
  });

  describe('buildSoundCloudPlayerUrl', () => {
    it('should return a valid SoundCloud player URL for a valid SoundCloud URL', () => {
      const url = 'https://soundcloud.com/artist/track';
      const expectedPlayerUrl = 'https://w.soundcloud.com/player/?url=' + url;
      expect(service.buildSoundCloudPlayerUrl(url)).toBe(expectedPlayerUrl);
    });

    it('should throw an error for an invalid SoundCloud URL', () => {
      const url = 'https://example.com/artist/track';
      expect(() => service.buildSoundCloudPlayerUrl(url)).toThrow('Should inform an SoundCloud URL');
    });
  });
});
