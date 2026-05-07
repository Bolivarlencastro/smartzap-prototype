import { TransfersFiltersService } from './transfers-filters.service';
import { MatDialog } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import { EMPTY, of } from 'rxjs';
import { TransfersFilterDialogComponent } from '../containers/transfers-filter-dialog/transfers-filter-dialog.component';
import { TransferService } from 'app/main/transfer/services/transfer.service';

describe('TransfersFiltersService', () => {
  let service: TransfersFiltersService;
  let dialogMock: jest.Mocked<MatDialog>;
  let httpMock: jest.Mocked<KonquestAPI>;

  beforeEach(() => {
    dialogMock = {
      open: jest.fn(() => ({
        afterClosed: jest.fn(() => of(EMPTY)),
      })),
    } as unknown as jest.Mocked<MatDialog>;

    httpMock = {
      get: jest.fn(() => of({ results: [{ name: 'mock_item', id: 'mock_id' }] })),
    } as unknown as jest.Mocked<KonquestAPI>;

    service = new TransfersFiltersService(dialogMock, httpMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open the filter dialog', (done) => {
    service.openDialog().subscribe(() => {
      expect(dialogMock.open).toHaveBeenCalledWith(TransfersFilterDialogComponent, {
        autoFocus: 'dialog',
        maxWidth: '90vw',
        minWidth: '400px',
      });

      done();
    });
  });

  it('should filter the workspaces', (done) => {
    service.filterWorkspaces('mock_filter').subscribe(() => {
      expect(httpMock.get).toHaveBeenCalledWith('/missions/transactions/workspaces', {
        per_page: 10,
        search: 'mock_filter',
      });

      done();
    });
  });

  describe('mapAutocompleteOptions', () => {
    it('should map the autocomplete options to a string array', () => {
      const originalFilter = {
        source__in: [
          { label: 'mock_label', value: 'mock_id' },
          {
            label: 'mock_label_2',
            value: 'mock_id_2',
          },
        ],
      };

      const expectedFilter = {
        source__in: 'mock_id,mock_id_2',
        receiver__in: null,
      };

      const result = TransferService.mapAutocompleteOptions(originalFilter);

      expect(result).toEqual(expectedFilter);
    });
  });
});
