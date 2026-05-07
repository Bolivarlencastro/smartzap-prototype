import { SecurityContext } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { KpSafeUrlPipe } from './kp-safe-url.pipe';

describe('kpSafeUrl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });

  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new KpSafeUrlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));

  it('should return empty when pass an empty value', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new KpSafeUrlPipe(domSanitizer);
    const value = pipe.transform('');
    expect(value).toBe('');
  }));

  it('should sanitize the url', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new KpSafeUrlPipe(domSanitizer);
    const safeResourceUrl = 'https://teste.com/teste.txt';
    const value = pipe.transform(safeResourceUrl);
    const sanitizedValue = domSanitizer.sanitize(SecurityContext.RESOURCE_URL, value);
    expect(sanitizedValue).toEqual(safeResourceUrl);
  }));
});
