import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificatesHeaderComponent } from './certificates-header.component';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';

describe('CertificatesHeaderComponent', () => {
  let component: CertificatesHeaderComponent;
  let fixture: ComponentFixture<CertificatesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatesHeaderComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificatesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call create certificate', () => {
    jest.spyOn(component.newItemEvent, 'emit');
    component.createCertificate();
    expect(component.newItemEvent.emit).toHaveBeenCalled();
  });
});
