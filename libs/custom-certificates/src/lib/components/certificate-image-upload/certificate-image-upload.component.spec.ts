import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateImageUploadComponent } from './certificate-image-upload.component';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('CertificateImageUploadComponent', () => {
  let component: CertificateImageUploadComponent;
  let fixture: ComponentFixture<CertificateImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateImageUploadComponent, getTranslocoTestingModule(), NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open the file selection when clicking on the mat-form-field', () => {
    const inputClickSpy = jest.spyOn(component.fileInput.nativeElement, 'click');
    const formField = fixture.debugElement.query(By.css('mat-form-field'));

    formField.nativeElement.click();

    expect(inputClickSpy).toHaveBeenCalled();
  });

  describe('onFileInputChante', () => {
    it('should set the file name and emit the imageSelected event', () => {
      const emitSpy = jest.spyOn(component.imageSelected, 'emit');
      const file = new File([], 'image.png');
      const mockFileList = {
        0: file,
        length: 1,
        item: () => file,
      } as unknown as FileList;
      Object.defineProperty(component.fileInput.nativeElement, 'files', { value: mockFileList, writable: false });

      component.onFileInputChange(component.fileInput.nativeElement);

      expect(component.fileName()).toBe('image.png');
      expect(emitSpy).toHaveBeenCalledWith(file);
    });
  });
});
