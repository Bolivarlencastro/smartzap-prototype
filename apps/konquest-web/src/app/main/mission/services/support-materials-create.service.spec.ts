import { SupportMaterialsCreateService } from './support-materials-create.service';
import { KontentAPI } from '@core/api';
import { MissionServiceV2 } from './mission.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { SupportMaterialActions } from 'app/main/mission/pages/mission-create/store';
import { SupportMaterial } from 'app/main/mission/mission.model';

describe('SupportMaterialsCreateService', () => {
  let service: SupportMaterialsCreateService;
  let kontentApiMock: jest.Mocked<KontentAPI>;
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let storeMock: jest.Mocked<Store>;
  let dialogMock: jest.Mocked<MatDialog>;
  let uploadSubject: Subject<any>;
  const mockSupportMaterial = { id: 'lc-1', name: 'file.pdf', description: 'desc' } as unknown as SupportMaterial;

  beforeEach(() => {
    uploadSubject = new Subject();
    kontentApiMock = {
      postFormData2: jest.fn().mockReturnValue(uploadSubject.asObservable()),
    } as unknown as jest.Mocked<KontentAPI>;
    missionServiceMock = {
      createSupportMaterial: jest.fn().mockReturnValue(of(mockSupportMaterial)),
    } as unknown as jest.Mocked<MissionServiceV2>;
    messageServiceMock = { error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    storeMock = { dispatch: jest.fn() } as unknown as jest.Mocked<Store>;
    dialogMock = {
      open: jest.fn().mockReturnValue({ componentInstance: {}, afterClosed: jest.fn().mockReturnValue(of(true)) }),
    } as unknown as jest.Mocked<MatDialog>;

    service = new SupportMaterialsCreateService(
      kontentApiMock,
      missionServiceMock,
      messageServiceMock,
      storeMock,
      dialogMock,
    );
  });

  describe('createUpload', () => {
    const file = new File(['content'], 'file.pdf', { type: 'application/pdf' });
    const eventId = 'evt-1';

    it('should update progress on UploadProgress events', () => {
      service.createUpload(file, eventId);
      const uploadId = service.uploads()[0].id;

      uploadSubject.next({ type: HttpEventType.UploadProgress, loaded: 50, total: 100 });

      const upload = service.getUpload(uploadId);
      expect(upload.percentage).toBe(50);
      expect(upload.loading).toBe(true);
    });

    it('should create support material on Response, mark upload as finished, and dispatch success', () => {
      service.createUpload(file, eventId);
      const uploadId = service.uploads()[0].id;

      uploadSubject.next({ type: HttpEventType.Response, body: mockSupportMaterial });

      const upload = service.getUpload(uploadId);
      expect(upload.percentage).toBe(100);
      expect(upload.loading).toBe(false);

      expect(storeMock.dispatch).toHaveBeenCalledWith(
        SupportMaterialActions.uploadSupportMaterialSuccess({ supportMaterial: mockSupportMaterial }),
      );
    });

    it('should handle errors: show message and reset progress/loading', () => {
      service.createUpload(file, eventId);
      const uploadId = service.uploads()[0].id;

      uploadSubject.error(new Error('upload failed'));

      expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.SUPPORT_MATERIAL');

      const upload = service.getUpload(uploadId);
      expect(upload.percentage).toBe(0);
      expect(upload.loading).toBe(false);
    });
  });

  describe('openDeleteConfirmDialog', () => {
    it('should open dialog, set messages, and return afterClosed value', (done) => {
      service.openDeleteConfirmDialog().subscribe((value) => {
        expect(dialogMock.open).toHaveBeenCalled();
        expect(value).toBe(true);
        done();
      });
    });
  });
});
