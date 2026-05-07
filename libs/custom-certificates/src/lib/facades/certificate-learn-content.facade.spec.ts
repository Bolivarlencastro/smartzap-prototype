import { CertificateLearnContentFacade } from './certificate-learn-content.facade';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { CertificateLearnContentActions, CertificatesListActions } from '../store/actions';
import { Chance } from 'chance';
import { CustomCertificateDto, LearnContentCertificateChange } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CertificateLearnContentFacade', () => {
  let facade: CertificateLearnContentFacade;
  let storeMock: jest.Mocked<Store>;
  const chance = new Chance();

  beforeEach(async () => {
    storeMock = { select: jest.fn().mockReturnValue(of(EMPTY)), dispatch: jest.fn() } as unknown as jest.Mocked<Store>;
    facade = new CertificateLearnContentFacade(storeMock);
  });

  it('should dispatch the load certificates for learn content action', () => {
    facade.loadCertificatesForLearnContent('mission');

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      CertificatesListActions.loadCertificatesForLearnContent({ template: 'mission' }),
    );
  });

  it('should dispatch the load learn content action', () => {
    const learnContentId = chance.guid();

    facade.loadLearnContentCertificate(learnContentId);

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      CertificateLearnContentActions.loadLearnContentCertificate({ learnContentId }),
    );
  });

  it('should dispatch the vinculate learn content action', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    const learnContentId = chance.guid();
    const event: LearnContentCertificateChange = { certificate, learnContentId };

    facade.saveLearnContentCertificate(event);

    expect(storeMock.dispatch).toHaveBeenCalledWith(CertificateLearnContentActions.vinculateLearnContent({ event }));
  });

  it('should dispatch the desvinculate learn content action', () => {
    const learnContentId = chance.guid();
    const event: LearnContentCertificateChange = { certificate: null, learnContentId };

    facade.saveLearnContentCertificate(event);

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      CertificateLearnContentActions.desvinculateLearnContent({ learnContentId }),
    );
  });

  it('should dispatch the preview certificate action', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;

    facade.previewCertificate(certificate);

    expect(storeMock.dispatch).toHaveBeenCalledWith(CertificatesListActions.previewCertificate({ certificate }));
  });
});
