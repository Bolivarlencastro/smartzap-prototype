import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PushManagerApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { PanelService } from './panel.service';

describe('PanelService', () => {
  let service: PanelService;
  let api: jest.Mocked<PushManagerApi>;
  let dialog: jest.Mocked<MatDialog>;

  const mockPaginatedResponse = (items: unknown[]) => ({
    data: items,
    links: { current: '', last: '', next: '', previous: '', first: '' },
    meta: { current_page: 1, itemsPerPage: 10, sortBy: [], totalItems: items.length, totalPages: 1 },
  });

  const buildDialogRef = (confirmed: boolean) =>
    ({
      componentInstance: { confirmTitle: '', confirmMessage: '', positiveButtonLabel: '' },
      afterClosed: jest.fn().mockReturnValue(of(confirmed)),
    }) as unknown as MatDialogRef<unknown>;

  beforeEach(() => {
    api = {
      fetchBalance: jest.fn().mockReturnValue(of({ balance: '3.52', currency: 'BRL', company_id: '1' })),
      fetchGeneralStats: jest.fn().mockReturnValue(of({ total_dispatches: 36450, total_investment: '4350.75' })),
      fetchCampaigns: jest.fn().mockReturnValue(of(mockPaginatedResponse([]))),
      cancelCampaign: jest.fn().mockReturnValue(of(void 0)),
    } as unknown as jest.Mocked<PushManagerApi>;

    dialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;

    TestBed.configureTestingModule({
      providers: [PanelService, { provide: PushManagerApi, useValue: api }, { provide: MatDialog, useValue: dialog }],
    });

    service = TestBed.inject(PanelService);
  });

  it('should return summary mapped from balance and stats APIs', (done) => {
    service.fetchSummary().subscribe((value) => {
      expect(value).toEqual({ pushCount: 36450, totalInvestiment: '4350.75', currentBalance: '3.52' });
      done();
    });
  });

  it('should call fetchCampaigns with SCHEDULED status for upcoming appointments', (done) => {
    service.fetchUpcomingAppointments({ page: 1, limit: 10 }).subscribe(() => {
      expect(api.fetchCampaigns).toHaveBeenCalledWith(
        expect.objectContaining({ status: ['SCHEDULED'], page: 1, limit: 10 }),
      );
      done();
    });
  });

  it('should call fetchCampaigns with history statuses for push history', (done) => {
    service.fetchPushHistory({ page: 1, limit: 10 }).subscribe(() => {
      expect(api.fetchCampaigns).toHaveBeenCalledWith(
        expect.objectContaining({ status: ['PROCESSING', 'COMPLETED', 'FAILED', 'CANCELED'], page: 1, limit: 10 }),
      );
      done();
    });
  });

  it('should call api.cancelCampaign when dialog is confirmed', (done) => {
    dialog.open.mockReturnValue(buildDialogRef(true));
    service.cancelCampaign('campaign-123').subscribe(() => {
      expect(api.cancelCampaign).toHaveBeenCalledWith('campaign-123');
      done();
    });
  });

  it('should not call api.cancelCampaign when dialog is dismissed', () => {
    dialog.open.mockReturnValue(buildDialogRef(false));
    const next = jest.fn();
    service.cancelCampaign('campaign-123').subscribe({ next });
    expect(api.cancelCampaign).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
