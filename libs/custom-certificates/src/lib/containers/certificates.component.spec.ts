import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificatesComponent } from './certificates.component';
import { CertificatesListFacade, NewCertificateDialogFacade } from '../facades';
import { of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Chance } from 'chance';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../helpers/transloco-testing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CertificatesComponent', () => {
  let component: CertificatesComponent;
  let fixture: ComponentFixture<CertificatesComponent>;
  let newCertificateDialogFacade: jest.Mocked<NewCertificateDialogFacade>;
  let certificatesListFacade: jest.Mocked<CertificatesListFacade>;
  const chance = new Chance();

  beforeEach(async () => {
    newCertificateDialogFacade = {
      newCertificate: jest.fn(),
      editCertificate: jest.fn(),
    } as unknown as jest.Mocked<NewCertificateDialogFacade>;
    certificatesListFacade = {
      certificates$: of([]),
      isLoading$: of(false),
      filter$: of({}),
      totalItems$: of(0),
      loadCertificates: jest.fn(),
      pageChange: jest.fn(),
      deleteCertificate: jest.fn(),
      toggleDefaultCertificate: jest.fn(),
      search: jest.fn(),
      previewCertificate: jest.fn(),
      resetState: jest.fn(),
    } as unknown as jest.Mocked<CertificatesListFacade>;
    await TestBed.configureTestingModule({
      imports: [CertificatesComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [
        {
          provide: CertificatesListFacade,
          useValue: certificatesListFacade,
        },
        { provide: NewCertificateDialogFacade, useValue: newCertificateDialogFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the certificates upon initialization', () => {
    component.ngOnInit();

    expect(certificatesListFacade.loadCertificates).toHaveBeenCalled();
  });

  it('should open the new certificate dialog', () => {
    component.newCertificate();

    expect(newCertificateDialogFacade.newCertificate).toHaveBeenCalled();
  });

  it('should search by text', () => {
    component.onSearch('filter');

    expect(certificatesListFacade.search).toHaveBeenCalledWith('filter');
  });

  it('should navigate with pagination', () => {
    component.pageChanged({ pageSize: 10, pageIndex: 2 } as PageEvent);

    expect(certificatesListFacade.pageChange).toHaveBeenCalledWith({ page: 3, per_page: 10 });
  });

  it('should open the edit certificate dialog', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    component.editCertificate(certificate);

    expect(newCertificateDialogFacade.editCertificate).toHaveBeenCalledWith(certificate);
  });

  it('should delete a certificate', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    component.deleteCertificate(certificate);

    expect(certificatesListFacade.deleteCertificate).toHaveBeenCalledWith(certificate);
  });

  it('should toggle a certificate as default', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    component.toggleDefaultCertificate(certificate);

    expect(certificatesListFacade.toggleDefaultCertificate).toHaveBeenCalledWith(certificate);
  });

  it('should preview a certificate', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    component.previewCertificate(certificate);

    expect(certificatesListFacade.previewCertificate).toHaveBeenCalledWith(certificate);
  });

  it('should reset the state when destroying the component', () => {
    component.ngOnDestroy();

    expect(certificatesListFacade.resetState).toHaveBeenCalled();
  });
});
