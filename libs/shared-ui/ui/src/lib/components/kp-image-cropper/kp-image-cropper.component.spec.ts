import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpImageCropperComponent } from './kp-image-cropper.component';
import { ImageCropperModel } from './models';

const mockData: ImageCropperModel = {
  aspectRatio: 1,
  fileEvent: new Event('change'),
  resizeToWidth: 300,
  resizeToHeight: 300,
};

describe('KpImageCropperComponent', () => {
  let component: KpImageCropperComponent;
  let fixture: ComponentFixture<KpImageCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        KpImageCropperComponent,
        ImageCropperComponent,
        getTranslocoTestingModule(),
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressBarModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KpImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', () => {
    expect(component.aspectRatio).toEqual(mockData.aspectRatio);
    expect(component.imageChangedEvent).toEqual(mockData.fileEvent);
    expect(component.loading).toBe(true);
    expect(component.resizeToWidth).toBe(mockData.resizeToWidth);
    expect(component.resizeToHeight).toBe(mockData.resizeToHeight);
  });

  it('should set croppedImage when objectUrl is a valid blob URL', () => {
    const event = {
      objectUrl: 'blob:http://localhost/some-uuid',
    } as ImageCroppedEvent;

    component.imageCropped(event);

    expect(component.croppedImage).toBe(event.objectUrl);
  });

  it('should not set croppedImage when objectUrl is null', () => {
    const event = { objectUrl: null } as ImageCroppedEvent;

    component.imageCropped(event);

    expect(component.croppedImage).toBeUndefined();
  });

  it('should not set croppedImage when objectUrl is not a blob URL', () => {
    const event = {
      objectUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
    } as ImageCroppedEvent;

    component.imageCropped(event);

    expect(component.croppedImage).toBeUndefined();
  });

  it('should handle cropperReady event', () => {
    component.cropperReady();
    expect(component.loading).toBe(false);
  });
});
