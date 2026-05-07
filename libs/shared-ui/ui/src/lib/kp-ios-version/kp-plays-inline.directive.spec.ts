import { KpPlaysInlineDirective } from './kp-plays-inline.directive';
import { Platform } from '@angular/cdk/platform';
import { ElementRef } from '@angular/core';

describe('kpPlaysInline', () => {
  let platformMock: jest.Mocked<Platform>;
  let elementMock: jest.Mocked<ElementRef>;
  let userAgentSpy: jest.SpyInstance;
  const iOS17UserAgentString = 'iPhone OS 17_7';
  const iOS18UserAgentString = 'iPhone OS 18_0';

  beforeEach(() => {
    platformMock = { iOSVersion: 17, IOS: true } as unknown as jest.Mocked<Platform>;
    elementMock = { nativeElement: {} } as jest.Mocked<ElementRef>;
    userAgentSpy = jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(iOS17UserAgentString);
  });

  it('should add the playsInline parameter as true if the current device is an iOS 17 and the video URL is from Vimeo', () => {
    const directive = new KpPlaysInlineDirective(platformMock, elementMock);
    directive.kpPlaysInline = 'https://vimeo.com/<video-id>';
    directive.ngOnInit();
    expect(elementMock.nativeElement['playsInline']).toBe(true);
  });

  it('should add the playsInline parameter as true if the video URL is from Youtube', () => {
    const directive = new KpPlaysInlineDirective(platformMock, elementMock);
    directive.kpPlaysInline = 'https://youtu.be/<video-id>';
    directive.ngOnInit();
    expect(elementMock.nativeElement['playsInline']).toBe(true);
  });

  it('should not add the playsInline parameter if the current device is an iOS version > 17 and the video URL is from Vimeo', () => {
    const directive = new KpPlaysInlineDirective(platformMock, elementMock);
    directive.kpPlaysInline = 'https://vimeo.com/<video-id>';
    userAgentSpy.mockReturnValueOnce(iOS18UserAgentString);
    directive.ngOnInit();
    expect(elementMock.nativeElement['playsInline']).toBeFalsy();
  });
});
