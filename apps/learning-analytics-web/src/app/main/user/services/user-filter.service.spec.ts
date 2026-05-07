import { UserFilterService } from './user-filter.service';
import { KonquestApiClient, MyAccountApiClient } from '@core/api';
import { MatDialog } from '@angular/material/dialog';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

describe('UserFilterService', () => {
  let service: UserFilterService;
  let dialogMock: jest.Mocked<MatDialog>;
  let translateServiceMock: jest.Mocked<TranslocoService>;
  let fuseLoadingServiceMock: jest.Mocked<FuseLoadingService>;
  let myAccountApiMock: jest.Mocked<MyAccountApiClient>;
  let konquestApiMock: jest.Mocked<KonquestApiClient>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;

  beforeEach(() => {
    dialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(EMPTY)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    translateServiceMock = {
      translate: jest.fn().mockImplementation((value) => value),
    } as unknown as jest.Mocked<TranslocoService>;

    fuseLoadingServiceMock = { show: jest.fn(), hide: jest.fn() } as unknown as jest.Mocked<FuseLoadingService>;
    myAccountApiMock = { get: jest.fn() } as unknown as jest.Mocked<MyAccountApiClient>;
    konquestApiMock = { getCategories: jest.fn() } as unknown as jest.Mocked<KonquestApiClient>;

    workspaceServiceMock = {
      getCurrentWorkspace: { id: 'mock_workspace_id' },
    } as unknown as jest.Mocked<WorkspaceService>;

    service = new UserFilterService(
      dialogMock,
      translateServiceMock,
      fuseLoadingServiceMock,
      myAccountApiMock,
      konquestApiMock,
      workspaceServiceMock,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openFilters', () => {
    it('should open the filter dialog', () => {
      service.openFilters('overview');

      expect(dialogMock.open).toHaveBeenCalled();
    });
  });
});
