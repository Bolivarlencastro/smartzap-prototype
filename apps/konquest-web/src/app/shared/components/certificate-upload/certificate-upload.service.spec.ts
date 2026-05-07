import { CertificateUploadService } from './certificate-upload.service';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';

describe('CertificateUploadService', () => {
  let service: CertificateUploadService;
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let dialogMock: jest.Mocked<MatDialog>;

  beforeEach(() => {
    missionServiceMock = {
      loadHistory: jest.fn(() => of(EMPTY)),
      submitCertificate: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<MissionServiceV2>;

    dialogMock = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;

    service = new CertificateUploadService(missionServiceMock, dialogMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call loadCertificate', (done) => {
    service.loadCertificateHistory('mock_id').subscribe(() => {
      expect(missionServiceMock.loadHistory).toHaveBeenCalledWith('mock_id');

      done();
    });
  });

  it('should call submitCertificate with the stored certificate', (done) => {
    const mockFile = { name: test } as unknown as File;
    service.submitCertificate('mock_id', mockFile).subscribe(() => {
      expect(missionServiceMock.submitCertificate).toHaveBeenCalledWith('mock_id', mockFile);

      done();
    });
  });
});
