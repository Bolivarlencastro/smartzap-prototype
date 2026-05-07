import { CertificateUploadFormComponent } from './certificate-upload-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('CertificateUploadFormComponent', () => {
  let component: CertificateUploadFormComponent;
  let fixture: ComponentFixture<CertificateUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateUploadFormComponent, getTranslocoTestingModule(), MatIconTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateUploadFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('fileInputChange', () => {
    it('should set selected file', () => {
      const mockFile = new File([''], 'test');

      const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('#input-certificate');
      jest.spyOn(fileInput, 'files', 'get').mockReturnValue({ item: jest.fn().mockReturnValue(mockFile), length: 1 });

      component.fileInputChange();

      expect(component.selectedFile).toBe(mockFile);
    });
  });
});
