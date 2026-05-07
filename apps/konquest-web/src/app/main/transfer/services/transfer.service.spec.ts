import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EMPTY, of, throwError } from 'rxjs';
import { TransferService } from './transfer.service';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

const mockDialogComponentInstance = {
  confirmTitle: '',
  confirmMessage: '',
  positiveButtonLabel: '',
  negativeButtonLabel: '',
};

describe('TransferService', () => {
  let service: TransferService;
  let konquestApi: jest.Mocked<KonquestAPI>;
  let dialog: jest.Mocked<MatDialog>;
  let fuseLoadingService: jest.Mocked<FuseLoadingService>;
  let messageService: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        TransferService,
        {
          provide: KonquestAPI,
          useValue: { get: jest.fn(), delete: jest.fn().mockReturnValue(of(EMPTY)) },
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue({
              afterClosed: jest.fn().mockReturnValue(of(EMPTY)),
              componentInstance: mockDialogComponentInstance,
            }),
          },
        },
        { provide: FuseLoadingService, useValue: { show: jest.fn(), hide: jest.fn() } },
        { provide: KpMessageService, useValue: { success: jest.fn(), error: jest.fn() } },
        { provide: KpMessageService, useValue: { success: jest.fn(), error: jest.fn() } },
      ],
    });
    service = TestBed.inject(TransferService);
    konquestApi = TestBed.inject(KonquestAPI) as jest.Mocked<KonquestAPI>;
    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    fuseLoadingService = TestBed.inject(FuseLoadingService) as jest.Mocked<FuseLoadingService>;
    messageService = TestBed.inject(KpMessageService) as jest.Mocked<KpMessageService>;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('fetch', () => {
    it('should call fetch transfers api', () => {
      const params = { page: 1, per_page: 10 };

      service.fetch(params);

      expect(konquestApi.get).toHaveBeenCalledWith('/missions/transactions', params);
    });
  });

  describe('confirmCancel', () => {
    it('should open the confirmation dialog', () => {
      service.confirmCancel('12345');

      expect(dialog.open).toHaveBeenCalled();
    });

    it('should call delete if the dialog result is true', (done) => {
      const mockId = '1';
      const deleteSpy = jest.spyOn(service, 'delete');

      dialog.open.mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
        componentInstance: mockDialogComponentInstance,
      } as any);

      service.confirmCancel(mockId).subscribe(() => {
        expect(deleteSpy).toHaveBeenCalledWith(mockId);
        done();
      });
    });
  });

  describe('delete', () => {
    it('should display the loading bar', () => {
      service.delete('1');

      expect(fuseLoadingService.show).toHaveBeenCalled();
    });

    it('should call delete transfer api', () => {
      const id = '1';

      service.delete(id);

      expect(konquestApi.delete).toHaveBeenCalledWith(`/missions/transactions/${id}`);
    });

    it('should hide the loading bar on success', (done) => {
      service.delete('1').subscribe(() => {
        expect(fuseLoadingService.hide).toHaveBeenCalled();
        done();
      });
    });

    it('should hide the loading bar on failure', (done) => {
      konquestApi.delete.mockReturnValue(throwError(() => new Error('Test error')));

      service.delete('1').subscribe({
        error: () => {
          expect(fuseLoadingService.hide).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should display the success message', (done) => {
      service.delete('1').subscribe(() => {
        expect(messageService.success).toHaveBeenCalledWith('TRANSFER.CANCEL.SUCCESS');
        done();
      });
    });

    it('should display the failure message', (done) => {
      konquestApi.delete.mockReturnValue(throwError(() => new Error('Test error')));

      service.delete('1').subscribe({
        error: () => {
          expect(messageService.error).toHaveBeenCalledWith('TRANSFER.CANCEL.ERROR');
          done();
        },
      });
    });
  });
});
