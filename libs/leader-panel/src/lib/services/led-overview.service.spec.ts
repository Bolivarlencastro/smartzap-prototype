import { LedOverviewService } from './led-overview.service';
import { MatDialog } from '@angular/material/dialog';
import { KeepsAppServices, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LedOverviewComponent } from '../containers/led-overview-dialog/led-overview.component';
import { LedOverViewTabs } from '../models/led-overview';

jest.mock('@keeps-platform-frontend-workspace/ui/constants', () => ({
  constants: { defaultPageSizeOptions: [10, 25, 50, 100] },
}));

const MOCK_SERVICES = {
  mission: {
    id: '0d3752f0-15d7-402a-8628-04ed47bcbf41',
  },
  event: {
    id: '8064f5d7-e9cb-4bb8-8cb5-09030a14bf52',
  },
  pulse: {
    id: 'f19a1f71-82fb-46df-ab88-bdd3700da124',
  },
  learning_trail: {
    id: '0d3752f0-15d7-402a-8628-04ed47bcbf42',
  },
};

describe('LedOverviewService', () => {
  let service: LedOverviewService;
  let dialogMock: jest.Mocked<MatDialog>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;

  beforeEach(() => {
    dialogMock = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    workspaceServiceMock = { isServiceActive: jest.fn() } as unknown as jest.Mocked<WorkspaceService>;

    service = new LedOverviewService(dialogMock, workspaceServiceMock, MOCK_SERVICES as unknown as KeepsAppServices);
  });

  it('should open the overview dialog', () => {
    service.openDialog();
    expect(dialogMock.open).toHaveBeenCalledWith(LedOverviewComponent, {
      width: '100%',
      maxWidth: '80vw',
      autoFocus: 'dialog',
      data: expect.any(Object),
    });
  });

  it('should set the tabs configuration based on the active services', () => {
    const activeServices = [MOCK_SERVICES.mission.id, MOCK_SERVICES.pulse.id];
    workspaceServiceMock.isServiceActive.mockImplementation((serviceId) => activeServices.includes(serviceId));
    const expectedConfiguration: Record<LedOverViewTabs, boolean> = {
      overview: true,
      courses: true,
      trails: false,
      pulses: true,
      channels: true,
      events: false,
    };

    service.openDialog();
    expect(dialogMock.open).toHaveBeenCalledWith(
      LedOverviewComponent,
      expect.objectContaining({ data: expectedConfiguration }),
    );
  });
});
