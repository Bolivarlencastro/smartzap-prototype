import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Chance } from 'chance';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';
import { CertificatesListComponent } from './certificates-list.component';

describe('CertificatesListComponent', () => {
  let component: CertificatesListComponent;
  let fixture: ComponentFixture<CertificatesListComponent>;
  const chance = new Chance();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatesListComponent, getTranslocoTestingModule(), NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the edit event', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    const editSpy = jest.spyOn(component.editCertificate, 'emit');

    component.onEdit(certificate);

    expect(editSpy).toHaveBeenCalledWith(certificate);
  });

  it('should emit the delete event', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    const deleteSpy = jest.spyOn(component.deleteCertificate, 'emit');

    component.onDelete(certificate);

    expect(deleteSpy).toHaveBeenCalledWith(certificate);
  });

  it('should emit the preview certificate event', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    const previewSpy = jest.spyOn(component.previewCertificate, 'emit');

    component.onPreviewCertificate(certificate);

    expect(previewSpy).toHaveBeenCalledWith(certificate);
  });

  it('should emit the toggleDefault event', () => {
    const certificate = { id: chance.guid() } as CustomCertificateDto;
    const toggleDefaultSpy = jest.spyOn(component.toggleDefault, 'emit');

    component.onToggleDefault(certificate);

    expect(toggleDefaultSpy).toHaveBeenCalledWith(certificate);
  });
});
