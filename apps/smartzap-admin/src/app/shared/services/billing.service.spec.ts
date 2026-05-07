import { TestBed } from '@angular/core/testing';
import { SmartzapAPI } from '@core/api';
import { Observable, of } from 'rxjs';
import { BillingService } from './billing.service';

class SmatzapAPIMock {
  get(_path: string, _params: any): Observable<any> {
    return of({});
  }
}

describe('BillingService', () => {
  let billingService: BillingService;
  let smartzapApi: SmartzapAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillingService,
        {
          provide: SmartzapAPI,
          useClass: SmatzapAPIMock,
        },
      ],
    });
    billingService = TestBed.inject(BillingService);
    smartzapApi = TestBed.inject(SmartzapAPI);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  describe('fetchBilling', () => {
    it('should request billing by workspace id', (done) => {
      const workspaceId = 'workspace-id';
      jest.spyOn(smartzapApi, 'get');

      billingService.fetchBilling(workspaceId).subscribe(() => {
        expect(smartzapApi.get).toHaveBeenCalledWith(`/workspace/${workspaceId}/billing`);
        done();
      });
    });
  });
});
