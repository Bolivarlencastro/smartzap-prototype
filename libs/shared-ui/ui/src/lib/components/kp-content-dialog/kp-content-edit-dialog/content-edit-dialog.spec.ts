import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContentEditDialogComponent, ContentEditDialogData } from './content-edit-dialog.component';
import { KpMessageService } from '../../../services/kp-message.service';
import { getTranslocoTestingModule } from '../../../transloco-testing.module';
import { ContentButtonService } from '../content-button.service';
import { CONTENT_DIALOG_APP, CONTENT_DIALOG_MODULE } from '../models';

describe('ContentEditDialogComponent', () => {
  let component: ContentEditDialogComponent;
  let fixture: ComponentFixture<ContentEditDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<ContentEditDialogComponent>>;
  let dialogData: ContentEditDialogData;
  let mockMessageService: jest.Mocked<KpMessageService>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<ContentEditDialogComponent>>;
    dialogData = {
      app: CONTENT_DIALOG_APP.KONQUEST,
      moduleName: CONTENT_DIALOG_MODULE.PULSE,
      editContentType: 'IMAGE',
      learnContentUrl: 'https://example.com/test.html',
    };
    mockMessageService = {
      error: jest.fn(),
      success: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    await TestBed.configureTestingModule({
      imports: [ContentEditDialogComponent, getTranslocoTestingModule()],
      providers: [
        ContentButtonService,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: KpMessageService, useValue: mockMessageService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSelectFile and handle file when valid', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    jest.spyOn(component.uploadInput.nativeElement.files, 'item').mockReturnValue(mockFile);
    jest.spyOn(component as any, 'handleSelectedFile').mockImplementation();

    component.onSelectFile();

    expect((component as any).handleSelectedFile).toHaveBeenCalledWith(mockFile);
  });

  // it('should call dialogRef.close with form value on save', () => {
  //   const formValue = { name: 'Test' };
  //   component.contentForm.setValue(formValue);
  //
  //   component.save();
  //
  //   expect(mockDialogRef.close).toHaveBeenCalledWith(formValue);
  // });

  it('should close the dialog on file selection cancel', () => {
    component.onFileSelectionCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should display an error message when unsupported file type is selected', () => {
    (component as any).acceptTypes = ['application/json'];
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });

    (component as any).handleSelectedFile(invalidFile);

    expect(mockMessageService.error).toHaveBeenCalledWith('UI.KP_CONTENT_DIALOG.SELECT_SAME_TYPE_ERROR');
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
