import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ImageUploadComponent } from './image-upload.component';

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('uploadType', 'COURSE_CARD');

    fixture.detectChanges();
  });

  describe('File Input Interactions', () => {
    it('should trigger file input click when upload button is clicked', () => {
      const clickSpy = jest.spyOn(component.fileInput.nativeElement, 'click');

      component.onUploadClick();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should emit goToCrop when file input changes with valid file', () => {
      const emitSpy = jest.spyOn(component.goToCrop, 'emit');
      const mockFile = new File([''], 'test-image.png', { type: 'image/png' });
      const mockFileList = {
        0: mockFile,
        length: 1,
        item: () => mockFile,
      } as unknown as FileList;
      Object.defineProperty(component.fileInput.nativeElement, 'files', { value: mockFileList, writable: false });

      component.onFileInputChange();

      expect(emitSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should not emit goToCrop when file input changes with no file', () => {
      const emitSpy = jest.spyOn(component.goToCrop, 'emit');

      component.fileInput.nativeElement.files = null;
      component.onFileInputChange();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Drag and Drop Events', () => {
    it('should emit goToCrop on valid file drop', () => {
      const emitSpy = jest.spyOn(component.goToCrop, 'emit');
      const mockFile = new File([''], 'test-image.png', { type: 'image/png' });

      const dropEvent = {
        preventDefault: jest.fn(),
        dataTransfer: {
          files: {
            0: mockFile,
            length: 1,
            item: () => mockFile,
          },
        },
      } as unknown as DragEvent;

      component.fileDrop(dropEvent);

      expect(dropEvent.preventDefault).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should not emit goToCrop on drop with no files', () => {
      const emitSpy = jest.spyOn(component.goToCrop, 'emit');

      const dropEvent = {
        preventDefault: jest.fn(),
        dataTransfer: {
          files: null,
        },
      } as unknown as DragEvent;

      component.fileDrop(dropEvent);

      expect(dropEvent.preventDefault).toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should prevent default on drag over', () => {
      const dragOverEvent = {
        preventDefault: jest.fn(),
      } as unknown as DragEvent;

      component.onDragOver(dragOverEvent);

      expect(dragOverEvent.preventDefault).toHaveBeenCalled();
    });
  });
});
