import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CertificateUploadActions, certificateUploadFeatureInitialState } from '../store';
import { Store } from '@ngrx/store';
import { CertificateUploadDialogComponent } from './certificate-upload-dialog.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('CertificateUploadFormComponent', () => {
  let component: CertificateUploadDialogComponent;
  let fixture: ComponentFixture<CertificateUploadDialogComponent>;
  let store: Store;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateUploadDialogComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [provideMockStore({ initialState: { certificateUpload: certificateUploadFeatureInitialState } })],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateUploadDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should dispatch uploadCertificate', () => {
    const certificateMock = { name: test } as unknown as File;

    component.submit(certificateMock);

    expect(dispatchSpy).toHaveBeenCalledWith(
      CertificateUploadActions.uploadCertificate({ certificate: certificateMock }),
    );
  });
});
