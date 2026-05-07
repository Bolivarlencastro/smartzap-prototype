import { TestBed } from '@angular/core/testing';
import { ScormUrlResolver } from './scorm-url.resolver';
import { APPLICATION_DOMAIN } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('ScormUrlResolver', () => {
  let service: ScormUrlResolver;
  const appDomain = 'https://konquest.keepsdev.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScormUrlResolver, { provide: APPLICATION_DOMAIN, useValue: appDomain }],
    });
    service = TestBed.inject(ScormUrlResolver);
  });

  it('should replace bucket domain with application domain for SCORM URLs', () => {
    const original = 'https://contents.keepsdev.com/scorm/12345-abcde-uuid/index.html';

    const resolved = service.resolveUrl(original);

    expect(resolved).toBe(`${appDomain}scorm/12345-abcde-uuid/index.html`);
  });

  it('should replace bucket domain with application domain for SCORM URLs in the newer format', () => {
    const original =
      'https://contents.keepsdev.com/clients/e76b5082-f4fe-4f41-be79-1977840e16a8/scorm/4344c3b2-8b72-4b61-97d0-06d5fca73b23_16d3/index.html';

    const resolved = service.resolveUrl(original);

    expect(resolved).toBe(
      `${appDomain}clients/e76b5082-f4fe-4f41-be79-1977840e16a8/scorm/4344c3b2-8b72-4b61-97d0-06d5fca73b23_16d3/index.html`,
    );
  });

  it('should return a proxied URL for SCORM URLs when useScormProxy is true', () => {
    const original = 'https://contents.keepsdev.com/scorm/12345-abcde-uuid/index.html';

    const resolved = service.resolveUrl(original, true);

    expect(resolved).toBe('/scorm-proxy/12345-abcde-uuid/index.html');
  });

  it('should return a proxied URL for SCORM URLs in the newer format when useScormProxy is true', () => {
    const original =
      'https://contents.keepsdev.com/clients/e76b5082-f4fe-4f41-be79-1977840e16a8/scorm/4344c3b2-8b72-4b61-97d0-06d5fca73b23_16d3/index.html';

    const resolved = service.resolveUrl(original, true);

    expect(resolved).toBe(
      '/scorm-proxy-v2/e76b5082-f4fe-4f41-be79-1977840e16a8/scorm/4344c3b2-8b72-4b61-97d0-06d5fca73b23_16d3/index.html',
    );
  });
});
