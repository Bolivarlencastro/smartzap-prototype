import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { CropComponent } from './crop.component';

describe('CropComponent', () => {
  let component: CropComponent;
  let fixture: ComponentFixture<CropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CropComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('image', new File([''], 'test.jpg', { type: 'image/jpeg' }));
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.jpg');
    fixture.componentRef.setInput('aspectRatio', 1);

    fixture.detectChanges();
  });

  describe('Output Events', () => {
    it('should emit backPressed event', () => {
      const backPressedSpy = jest.spyOn(component.backPressed, 'emit');

      component.onBackPressed();

      expect(backPressedSpy).toHaveBeenCalled();
    });

    it('should emit cropConfirmed when crop is successful', () => {
      const cropConfirmedSpy = jest.spyOn(component.cropConfirmed, 'emit');
      const mockObjectUrl = 'blob:http://localhost/test';

      component.onImageCropped({ objectUrl: mockObjectUrl } as ImageCroppedEvent);

      expect(cropConfirmedSpy).toHaveBeenCalledWith(mockObjectUrl);
    });

    it('should not emit cropConfirmed event', () => {
      const cropConfirmedSpy = jest.spyOn(component.cropConfirmed, 'emit');

      component.onImageCropped(null);

      expect(cropConfirmedSpy).not.toHaveBeenCalled();
    });
  });

  it('should set imageReady to true when imageLoaded is called', () => {
    expect(component.imageReady()).toBe(false);

    component.imageLoaded();

    expect(component.imageReady()).toBe(true);
  });
});
