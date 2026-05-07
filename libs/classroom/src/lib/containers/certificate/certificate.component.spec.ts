import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateComponent } from './certificate.component';
import { ClassroomFacade } from '../../facades';
import { EMPTY, of } from 'rxjs';
import { getTranslocoTestingModule } from '../../transloco-scope.factory';

describe('CertificateComponent', () => {
  let component: CertificateComponent;
  let fixture: ComponentFixture<CertificateComponent>;
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;

  beforeEach(async () => {
    classroomFacadeMock = {
      certificateUrl$: of(EMPTY),
      loadCertificate: jest.fn(),
      shareCertificate: jest.fn(),
    } as unknown as jest.Mocked<ClassroomFacade>;

    await TestBed.configureTestingModule({
      imports: [CertificateComponent, getTranslocoTestingModule()],
      providers: [{ provide: ClassroomFacade, useValue: classroomFacadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the certificate upon creation', () => {
    expect(classroomFacadeMock.loadCertificate).toHaveBeenCalled();
  });

  it('should share the certificate', () => {
    component.shareCertificate();
    expect(classroomFacadeMock.shareCertificate).toHaveBeenCalled();
  });
});
