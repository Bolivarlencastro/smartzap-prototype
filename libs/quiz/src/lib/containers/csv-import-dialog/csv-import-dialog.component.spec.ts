import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { CsvImportDialogComponent } from './csv-import-dialog.component';
import { CsvImportActions } from '../../store/csv-import/csv-import.actions';
import { csvImportFeature } from '../../store/csv-import/csv-import.feature';
import { QuestionInput } from '../../models/quiz';

const mockQuestions: QuestionInput[] = [
  { question_text: 'Pergunta 1', options: [{ option: 'A', correct_answer: true }], save_to_bank: false },
  { question_text: 'Pergunta 2', options: [{ option: 'B', correct_answer: false }], save_to_bank: true },
];

function makeDragEvent(files: File[] = []): DragEvent {
  const fileList = Object.assign(files, {
    item: (i: number) => files[i] ?? null,
  }) as unknown as FileList;
  return {
    preventDefault: jest.fn(),
    dataTransfer: { files: fileList },
  } as unknown as DragEvent;
}

function makeFileList(file: File): FileList {
  return Object.assign([file], { item: (i: number) => (i === 0 ? file : null) }) as unknown as FileList;
}

describe('CsvImportDialogComponent', () => {
  let component: CsvImportDialogComponent;
  let fixture: ComponentFixture<CsvImportDialogComponent>;
  let store: MockStore;
  let dialogRef: jest.Mocked<MatDialogRef<CsvImportDialogComponent>>;

  beforeEach(async () => {
    dialogRef = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<CsvImportDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [CsvImportDialogComponent, getTranslocoTestingModule()],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }, provideMockStore()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(csvImportFeature.selectStatus, 'idle');
    store.overrideSelector(csvImportFeature.selectQuestions, []);
    store.overrideSelector(csvImportFeature.selectErrorMessage, null);
    store.overrideSelector(csvImportFeature.selectFileName, null);

    fixture = TestBed.createComponent(CsvImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should dispatch reset on creation', () => {
      jest.spyOn(store, 'dispatch');

      TestBed.createComponent(CsvImportDialogComponent);

      expect(store.dispatch).toHaveBeenCalledWith(CsvImportActions.reset());
    });
  });

  describe('onCancel()', () => {
    it('should close the dialog without a value', () => {
      component['onCancel']();

      expect(dialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('onImport()', () => {
    it('should close the dialog with the current questions', () => {
      store.overrideSelector(csvImportFeature.selectQuestions, mockQuestions);
      store.refreshState();
      fixture.detectChanges();

      component['onImport']();

      expect(dialogRef.close).toHaveBeenCalledWith(mockQuestions);
    });
  });

  describe('onDragOver()', () => {
    it('should set isDragging to true', () => {
      component['onDragOver'](makeDragEvent());

      expect(component['isDragging']()).toBe(true);
    });

    it('should call event.preventDefault()', () => {
      const event = makeDragEvent();

      component['onDragOver'](event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('onDragLeave()', () => {
    it('should set isDragging to false', () => {
      component['isDragging'].set(true);

      component['onDragLeave']();

      expect(component['isDragging']()).toBe(false);
    });
  });

  describe('onDrop()', () => {
    it('should dispatch parseFile with the dropped file', () => {
      jest.spyOn(store, 'dispatch');
      const mockFile = new File(['content'], 'questions.csv', { type: 'text/csv' });

      component['onDrop'](makeDragEvent([mockFile]));

      expect(store.dispatch).toHaveBeenCalledWith(CsvImportActions.parseFile({ file: mockFile }));
    });

    it('should set isDragging to false', () => {
      component['isDragging'].set(true);

      component['onDrop'](makeDragEvent());

      expect(component['isDragging']()).toBe(false);
    });

    it('should not dispatch when there are no files in the dataTransfer', () => {
      jest.spyOn(store, 'dispatch');

      component['onDrop'](makeDragEvent());

      expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: '[CSV Import] Parse File' }));
    });
  });

  describe('onFileSelected()', () => {
    it('should dispatch parseFile when the input has a file', () => {
      jest.spyOn(store, 'dispatch');
      const mockFile = new File(['content'], 'questions.csv', { type: 'text/csv' });
      const input = fixture.nativeElement.querySelector('#csv-file-input') as HTMLInputElement;
      Object.defineProperty(input, 'files', { value: makeFileList(mockFile), configurable: true });

      input.dispatchEvent(new Event('change'));

      expect(store.dispatch).toHaveBeenCalledWith(CsvImportActions.parseFile({ file: mockFile }));
    });

    it('should not dispatch when the input has no file', () => {
      jest.spyOn(store, 'dispatch');
      const input = fixture.nativeElement.querySelector('#csv-file-input') as HTMLInputElement;
      Object.defineProperty(input, 'files', {
        value: Object.assign([], { item: () => null }) as unknown as FileList,
        configurable: true,
      });

      input.dispatchEvent(new Event('change'));

      expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: '[CSV Import] Parse File' }));
    });
  });

  describe('onToggleSaveToBank()', () => {
    it('should dispatch toggleSaveToBank with the given index', () => {
      jest.spyOn(store, 'dispatch');

      component['onToggleSaveToBank'](1);

      expect(store.dispatch).toHaveBeenCalledWith(CsvImportActions.toggleSaveToBank({ index: 1 }));
    });
  });

  describe('onAddAllToBank()', () => {
    it('should dispatch addAllToBank', () => {
      jest.spyOn(store, 'dispatch');

      component['onAddAllToBank']();

      expect(store.dispatch).toHaveBeenCalledWith(CsvImportActions.addAllToBank());
    });
  });

  describe('template', () => {
    it('should show the spinner when status is parsing', () => {
      store.overrideSelector(csvImportFeature.selectStatus, 'parsing');
      store.refreshState();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();
    });

    it('should show the error message when status is error', () => {
      store.overrideSelector(csvImportFeature.selectStatus, 'error');
      store.refreshState();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.csv-import-message--error')).not.toBeNull();
    });

    it('should show the success message and preview when status is success', () => {
      store.overrideSelector(csvImportFeature.selectStatus, 'success');
      store.overrideSelector(csvImportFeature.selectQuestions, mockQuestions);
      store.refreshState();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.csv-import-message--success')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('.csv-import-preview')).not.toBeNull();
    });

    it('should disable the import button when status is not success', () => {
      const button = fixture.nativeElement.querySelector('button[color="primary"]') as HTMLButtonElement;

      expect(button.disabled).toBe(true);
    });

    it('should enable the import button when status is success', () => {
      store.overrideSelector(csvImportFeature.selectStatus, 'success');
      store.refreshState();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[color="primary"]') as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });
  });
});
