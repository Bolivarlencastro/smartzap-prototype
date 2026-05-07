import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';
import { KpImageCropperComponent } from '../../../kp-image-cropper';
import { ContentDialogService } from '../../content-dialog.service';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let contentDialogService: jest.Mocked<ContentDialogService>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: ContentDialogService, useValue: { imageUploader: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
      ],
      imports: [getTranslocoTestingModule(), FileUploadComponent, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    contentDialogService = TestBed.inject(ContentDialogService) as jest.Mocked<ContentDialogService>;
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open dialog and emit coverChange on file selection', () => {
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

    jest.spyOn(component.coverImageChange, 'emit');
    contentDialogService.imageUploader.mockReturnValue(of({ url: 'image.png' }));

    component.onSelectCoverImage({ event: mockEvent, element: null });

    expect(dialog.open).toHaveBeenCalledWith(KpImageCropperComponent, {
      autoFocus: false,
      disableClose: true,
      data: { fileEvent: mockEvent, aspectRatio: 1, resizeToWidth: 230, resizeToHeight: 230 },
    });

    expect(mockInputElement.value).toBe('');
    expect(component.coverImageChange.emit).toHaveBeenCalledWith('image.png');
  });

  it('should emit fileAsCoverChange', () => {
    const fileAsCoverChangeSpy = jest.spyOn(component.fileAsCoverChange, 'emit');

    component.useFileAsCover(true);

    expect(fileAsCoverChangeSpy).toHaveBeenCalled();
  });

  it('should call onSelectCoverImage if uploadInput is defined and checked is true', () => {
    const uploadFileInput = {} as HTMLInputElement;
    component.uploadFileInput = uploadFileInput;
    const checked = true;
    const onSelectCoverImageSpy = jest.spyOn(component, 'onSelectCoverImage').mockImplementation(() => {});

    component.useFileAsCover(checked);

    expect(onSelectCoverImageSpy).toHaveBeenCalledWith({
      event: { target: uploadFileInput as unknown },
      element: null,
    });
  });

  it('should clean coverImage if checked is false', () => {
    component.uploadFileInput = {} as HTMLInputElement;
    component.coverImage = 'Bulbasaur.png';
    const checked = false;
    const onSelectCoverImageSpy = jest.spyOn(component, 'onSelectCoverImage');

    component.useFileAsCover(checked);

    expect(onSelectCoverImageSpy).not.toHaveBeenCalled();
    expect(component.coverImage).toBe('');
  });
});
