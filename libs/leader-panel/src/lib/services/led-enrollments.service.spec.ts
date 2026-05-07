import { TestBed } from '@angular/core/testing';

import { LedEnrollmentsService } from './led-enrollments.service';

describe('LedEnrollmentsService', () => {
  let service: LedEnrollmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LedEnrollmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
