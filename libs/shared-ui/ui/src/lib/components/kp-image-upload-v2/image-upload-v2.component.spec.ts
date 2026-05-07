import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpImageCropperComponent } from '../kp-image-cropper';
import { IMAGE_UPLOAD_ERROR, ImageUploadV2Component } from './image-upload-v2.component';

const mockFile = new File([], 'filename.png', { type: 'image/png' });

describe('KpImageUploadV2Component', () => {
  let component: ImageUploadV2Component;
  let fixture: ComponentFixture<ImageUploadV2Component>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), ImageUploadV2Component],
      providers: [{ provide: MatDialog, useValue: { open: jest.fn() } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(ImageUploadV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('backgroundImage', () => {
    const mockSrc = 'mock_src';

    beforeEach(() => {
      component.imageSrc = mockSrc;
    });

    it('should return the formatted image source', () => {
      expect(component.backgroundImage).toBe(`url(${mockSrc})`);
    });

    it('should return empty string if the component has a file being dragged', () => {
      component.dragEnter();
      expect(component.backgroundImage).toBe('');
    });
  });

  describe('dragOver', () => {
    it('should call preventDefault', () => {
      const mockEvent = { preventDefault: jest.fn() } as unknown as DragEvent;

      component.dragOver(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('dragEnter', () => {
    it('should set is dragging to true', () => {
      component.dragEnter();

      expect(component.isDraggingOver).toBe(true);
    });
  });

  describe('dragleave', () => {
    it('should set is dragging to false', () => {
      component.dragEnter();
      component.dragLeave();

      expect(component.isDraggingOver).toBe(false);
    });
  });

  describe('uploadClick', () => {
    it('should call click on the file upload input', () => {
      const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('[data-test="image-upload-input"]');
      const clickSpy = jest.spyOn(fileInput, 'click');

      component.uploadClick();

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('onFileInputChange', () => {
    it('should open dialog and emit uploadImage on file selection', () => {
      const mockFile = new File([''], 'test.png', {
        type: 'image/png',
      });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as Event;

      const mockInputElement = document.createElement('input');
      mockInputElement.type = 'file';

      const mockFileList = {
        0: mockFile,
        length: 1,
        item: () => mockFile,
      } as unknown as FileList;

      Object.defineProperty(mockInputElement, 'files', {
        value: mockFileList,
        writable: false,
      });

      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(mockFile)),
      };
      (dialog.open as jest.Mock).mockReturnValue(mockDialogRef);

      jest.spyOn(component.uploadImage, 'emit');
      component.fileInput = { nativeElement: mockInputElement };
      component.aspectRatio = 3;
      component.resizeToWidth = 1920;
      component.resizeToHeight = 640;

      component.onFileInputChange(mockEvent);

      expect(dialog.open).toHaveBeenCalledWith(KpImageCropperComponent, {
        autoFocus: false,
        disableClose: true,
        data: { fileEvent: mockEvent, aspectRatio: 3, resizeToWidth: 1920, resizeToHeight: 640 },
      });

      expect(mockInputElement.value).toBe('');
      expect(component.uploadImage.emit).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('fileDrop', () => {
    const dataTransfer = { files: { item: jest.fn().mockReturnValue(mockFile) } };
    const mockEvent = { dataTransfer, preventDefault: jest.fn() } as unknown as DragEvent;

    it('should call preventDefault', () => {
      component.fileDrop(mockEvent as DragEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should set draggingOver to false', () => {
      component.dragEnter();

      component.fileDrop(mockEvent as DragEvent);

      expect(component.isDraggingOver).toBe(false);
    });

    it('should emit uploadImage', () => {
      const emitSpy = jest.spyOn(component.uploadImage, 'emit');

      component.fileDrop(mockEvent);

      expect(emitSpy).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('imageError', () => {
    let emitSpy;

    beforeEach(() => {
      emitSpy = jest.spyOn(component.imageError, 'emit');
    });

    it('should emit when a file is of an invalid type', () => {
      const mockInvalidFile = new File([], 'filename.png', { type: 'application/pdf' });
      const dataTransfer = { files: { item: jest.fn().mockReturnValue(mockInvalidFile) } };
      const mockEvent = { dataTransfer, preventDefault: jest.fn() } as unknown as DragEvent;

      component.fileDrop(mockEvent);

      expect(emitSpy).toHaveBeenCalledWith(IMAGE_UPLOAD_ERROR.FILE_TYPE);
    });

    it('should emit when the size of a file is too large', () => {
      const mockInvalidFile = new File([], 'filename.png', { type: 'image/png' });
      jest.spyOn(mockInvalidFile, 'size', 'get').mockReturnValue(11534336);
      const dataTransfer = { files: { item: jest.fn().mockReturnValue(mockInvalidFile) } };
      const mockEvent = { dataTransfer, preventDefault: jest.fn() } as unknown as DragEvent;

      component.fileDrop(mockEvent);

      expect(emitSpy).toHaveBeenCalledWith(IMAGE_UPLOAD_ERROR.FILE_SIZE);
    });
  });
});
