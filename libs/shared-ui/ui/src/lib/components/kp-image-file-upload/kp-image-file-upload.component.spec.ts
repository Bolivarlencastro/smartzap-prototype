import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { KpImageFileUploadComponent } from './kp-image-file-upload.component';
import { TranslocoPipe } from '@jsverse/transloco';

const mockFile = new FormControl(new File([''], 'mockImage.jpg', { type: 'image/jpeg' }));

describe('KpImageFileUploadComponent', () => {
  let component: KpImageFileUploadComponent;
  let fixture: ComponentFixture<KpImageFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpImageFileUploadComponent, TranslocoPipe, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(KpImageFileUploadComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', mockFile);
    fixture.detectChanges();
  });

  it('should call click function on fileInput element', () => {
    const clickSpy = jest.spyOn(component.fileInput.nativeElement, 'click');
    component.uploadInputClick();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should process file when to call onFileInputChange function', () => {
    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.fileName).toBe('mockImage.jpg');
    expect(component.control.value).toEqual(mockFile.value);
  });

  it('should clean input', () => {
    const setValueSpy = jest.spyOn(component.control, 'setValue');
    const emitSpy = jest.spyOn(component.srcEvent, 'emit');
    component.cleanInput();

    expect(component.fileName).toBe('');
    expect(setValueSpy).toHaveBeenCalledWith(null);
    expect(emitSpy).toHaveBeenCalledWith(null);
  });
});
