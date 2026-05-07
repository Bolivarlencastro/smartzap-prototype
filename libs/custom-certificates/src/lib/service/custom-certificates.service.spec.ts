import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';
import { CustomCertificatesApi, CustomCertificatesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import Chance from 'chance';
import { CustomCertificatesService } from './custom-certificates.service';
import { NewCertificateDialogComponent } from '../containers';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { CertificatePreviewDialogComponent } from '../components';

describe('CustomCertificatesService', () => {
  let service: CustomCertificatesService;
  let matDialogMock: jest.Mocked<MatDialog>;
  let customCertificatesApi: jest.Mocked<CustomCertificatesApi>;
  let dialogComponentStub: KpConfirmDialogComponent;
  let dialogRefStub: jest.Mocked<MatDialogRef<any>>;
  const chance = new Chance();

  beforeEach(() => {
    dialogComponentStub = {} as KpConfirmDialogComponent;
    dialogRefStub = {
      afterClosed: jest.fn().mockReturnValue(of(EMPTY)),
      componentInstance: dialogComponentStub,
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<any>>;
    matDialogMock = {
      open: jest.fn().mockReturnValue(dialogRefStub),
    } as unknown as jest.Mocked<MatDialog>;
    customCertificatesApi = {
      update: jest.fn(),
      create: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      toggleDefault: jest.fn(),
      vinculateLearnContent: jest.fn(),
      desvinculateLearnContent: jest.fn(),
      getLearnContentCertificate: jest.fn(),
      uploadImage: jest.fn(),
    } as unknown as jest.Mocked<CustomCertificatesApi>;
    service = new CustomCertificatesService(matDialogMock, customCertificatesApi);
  });

  it('should open the new certificate dialog', (done) => {
    service.openNewCertificateDialog().subscribe(() => {
      expect(matDialogMock.open).toHaveBeenCalledWith(NewCertificateDialogComponent, {
        autoFocus: 'dialog',
        width: '560px',
        disableClose: true,
      });

      done();
    });
  });

  it('should close the new certificate dialog', () => {
    service.openNewCertificateDialog();
    service.closeDialog();

    expect(dialogRefStub.close).toHaveBeenCalled();
  });

  it('should load the certificates', () => {
    const filter: CustomCertificatesFilter = { search: 'mock_search', page: 1, per_page: 10 };

    service.loadCertificates(filter);

    expect(customCertificatesApi.list).toHaveBeenCalledWith(filter);
  });

  it('should delete a certificate', () => {
    const certificateId = chance.guid();

    service.deleteCertificate(certificateId);

    expect(customCertificatesApi.delete).toHaveBeenCalledWith(certificateId);
  });

  it('should set the default certificate', () => {
    const certificateId = chance.guid();

    service.toggleDefaultCertificate(certificateId);

    expect(customCertificatesApi.toggleDefault).toHaveBeenCalledWith(certificateId);
  });

  it('should open the certificate deletion dialog', () => {
    service.openDeleteDialog();

    expect(matDialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '360px',
    });
    expect(dialogComponentStub.confirmTitle).toBe('CUSTOM_CERTIFICATES.DELETE_CONFIRMATION.TITLE');
    expect(dialogComponentStub.confirmMessage).toBe('CUSTOM_CERTIFICATES.DELETE_CONFIRMATION.MESSAGE');
  });

  describe('openCertificatePreview', () => {
    const cases: any[] = [
      [{ id: chance.guid(), orientation: 'portrait' }, '850px'],
      [{ id: chance.guid(), orientation: 'landscape' }, '700px'],
    ];

    test.each(cases)('should open this certificate preview dialog %p with this width: %p', (certificate, width) => {
      service.openCertificatePreview(certificate);

      expect(matDialogMock.open).toHaveBeenCalledWith(CertificatePreviewDialogComponent, {
        autoFocus: 'dialog',
        width,
        data: certificate,
      });
    });
  });

  it('should vinculate a learn content to a certificate', () => {
    const certificateId = chance.guid();
    const learnContentId = chance.guid();

    service.vinculateCertificate(certificateId, learnContentId);

    expect(customCertificatesApi.vinculateLearnContent).toHaveBeenCalledWith({ certificateId, learnContentId });
  });

  it('should desvinculate a learn content from a certificate', () => {
    const learnContentId = chance.guid();

    service.desvinculateCertificate(learnContentId);

    expect(customCertificatesApi.desvinculateLearnContent).toHaveBeenCalledWith(learnContentId);
  });

  it('should load the learn content certificate', () => {
    const learnContentId = chance.guid();

    service.loadLearnContentCertificate(learnContentId);

    expect(customCertificatesApi.getLearnContentCertificate).toHaveBeenCalledWith(learnContentId);
  });
});
