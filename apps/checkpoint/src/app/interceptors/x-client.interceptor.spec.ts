import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { xClientInterceptor } from './x-client.interceptor';
import { CheckInService } from '../services/check-in.service';
import { Chance } from 'chance';

describe('xClientInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  const chance = new Chance();
  const workspaceId = chance.guid();

  const mockCheckInService = {
    sessionData: jest.fn().mockReturnValue({ workspaceId }),
  } as unknown as CheckInService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CheckInService, useValue: mockCheckInService },
        provideHttpClient(withInterceptors([xClientInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add x-client header for requests', () => {
    http.get('/api/example').subscribe();

    const req = httpMock.expectOne('/api/example');

    expect(req.request.headers.get('x-client')).toBe(workspaceId);
    req.flush({});
  });

  it('should NOT add x-client header for i18n asset requests', () => {
    http.get('/assets/i18n/en.json').subscribe();

    const req = httpMock.expectOne('/assets/i18n/en.json');

    expect(req.request.headers.has('x-client')).toBe(false);
    req.flush({});
  });
});
