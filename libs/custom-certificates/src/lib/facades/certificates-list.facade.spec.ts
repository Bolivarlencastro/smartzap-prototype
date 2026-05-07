import { CertificatesListFacade } from './certificates-list.facade';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { CertificatesListActions } from '../store/actions';
import { Chance } from 'chance';
import { CustomCertificateDto, CustomCertificatesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CertificatesListFacade', () => {
  let facade: CertificatesListFacade;
  let storeMock: jest.Mocked<Store>;
  const chance = new Chance();

  beforeEach(async () => {
    storeMock = { select: jest.fn().mockReturnValue(of(EMPTY)), dispatch: jest.fn() } as unknown as jest.Mocked<Store>;
    facade = new CertificatesListFacade(storeMock);
  });

  it('should dispatch the certificates load action', () => {
    facade.loadCertificates();

    expect(storeMock.dispatch).toHaveBeenCalledWith(CertificatesListActions.loadCertificates());
  });

  it('should dispatch the delete certificates action', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;

    facade.deleteCertificate(certificate);

    expect(storeMock.dispatch).toHaveBeenCalledWith(CertificatesListActions.openDeleteDialog({ certificate }));
  });

  it('should dispatch the toggle default certificate action', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;

    facade.toggleDefaultCertificate(certificate);

    expect(storeMock.dispatch).toHaveBeenCalledWith(CertificatesListActions.toggleDefaultCertificate({ certificate }));
  });

  it('should dispatch the page change action', () => {
    const pagination = { page: 10, per_page: 10 } as CustomCertificatesFilter;

    facade.pageChange(pagination);

    expect(storeMock.dispatch).toHaveBeenCalledWith(CertificatesListActions.setPagination({ pagination }));
  });

  it('should dispatch the page search action', () => {
    facade.search('mock_filter');

    expect(storeMock.dispatch).toHaveBeenCalledWith(CertificatesListActions.search({ search: 'mock_filter' }));
  });
});
