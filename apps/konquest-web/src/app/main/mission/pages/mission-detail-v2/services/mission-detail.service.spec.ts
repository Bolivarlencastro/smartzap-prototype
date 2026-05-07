import { MissionDetailService } from './mission-detail.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MissionDetailDialogComponent } from '../containers/mission-detail-dialog/mission-detail-dialog.component';
import { of } from 'rxjs';
import { Mission } from 'app/main/mission/mission.model';
import { Router } from '@angular/router';
import { MissionDetailDialogContainerComponent } from '../containers/mission-detail-dialog-container/mission-detail-dialog-container.component';
import { RouteDialogService, TRAILS_DETAIL_PREFIX } from 'app/shared/services';

describe('MissionDetailService', () => {
  let service: MissionDetailService;

  let dialogMock: jest.Mocked<MatDialog>;
  let dialogRefMock: jest.Mocked<MatDialogRef<MissionDetailDialogComponent>>;
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let routerMock: jest.Mocked<Router>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  const mockMission: Mission = { id: 'mock_id' };
  let routeDialogServiceMock: jest.Mocked<RouteDialogService>;

  beforeEach(() => {
    dialogRefMock = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<MissionDetailDialogComponent>>;
    dialogMock = {
      open: jest.fn(() => dialogRefMock),
    } as unknown as jest.Mocked<MatDialog>;
    missionServiceMock = {
      fetchMissionById: jest.fn(() => of(mockMission)),
    } as unknown as jest.Mocked<MissionServiceV2>;
    messageServiceMock = { error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    routerMock = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    routeDialogServiceMock = { onDialogClosed: jest.fn() } as unknown as jest.Mocked<RouteDialogService>;

    service = new MissionDetailService(
      dialogMock,
      missionServiceMock,
      messageServiceMock,
      routeDialogServiceMock,
      routerMock,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDialog', () => {
    it('should open the dialog', () => {
      service.openDialog();

      expect(dialogMock.open).toHaveBeenCalledWith(MissionDetailDialogContainerComponent, {
        autoFocus: 'dialog',
        panelClass: 'route-dialog-container',
      });
    });

    it('should return the dialog reference', () => {
      const dialogRef = service.openDialog();

      expect(dialogRef).toEqual(dialogRefMock);
    });
  });

  describe('onDialogDestroyed', () => {
    it('should navigate call onDialogClosed in the routeDialogService', () => {
      service.onDialogDestroyed();

      expect(routeDialogServiceMock.onDialogClosed).toHaveBeenCalled();
    });

    it('should navigate to the rollbackTrailId if provided', () => {
      service.onDialogDestroyed('mock_rollback_id');

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`${TRAILS_DETAIL_PREFIX}/mock_rollback_id`);
    });
  });

  describe('closeDialog', () => {
    it('should call close on the dialogRef', () => {
      service.openDialog();

      service.closeDialog();

      expect(dialogRefMock.close).toHaveBeenCalled();
    });
  });

  describe('loadMission', () => {
    it('should call fetchMissionById', (done) => {
      service.loadMission('mock_id').subscribe((mission) => {
        expect(mission).toEqual(mockMission);
        done();
      });
    });
  });
});
