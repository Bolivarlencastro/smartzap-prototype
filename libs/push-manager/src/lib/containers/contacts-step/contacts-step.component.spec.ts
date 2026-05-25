import { CdkStepper } from '@angular/cdk/stepper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ContactsForm } from '../../models/creation';
import { CreationActions, creationInitialState } from '../../store';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ContactsStepComponent } from './contacts-step.component';

describe('ContactsStepComponent', () => {
  let component: ContactsStepComponent;
  let fixture: ComponentFixture<ContactsStepComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsStepComponent, getTranslocoTestingModule()],
      providers: [
        { provide: CdkStepper, useValue: {} },
        provideMockStore({ initialState: { 'pm-creation': creationInitialState } }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ContactsStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput(
      'form',
      new FormGroup<ContactsForm>({
        contacts: new FormControl(null),
      }),
    );

    fixture.detectChanges();
  });

  it('should initialize with default inputTitle', () => {
    expect(component.inputTitle()).toBe('PUSH_MANAGER.CREATION.CONTACTS.INPUT_TITLE');
  });

  it('should update inputTitle and contacts value when file is dropped', () => {
    const mockFile = new File(['content'], 'contacts.csv', { type: 'text/csv' });
    const mockDragEvent = {
      preventDefault: jest.fn(),
      dataTransfer: { files: { item: (): File => mockFile } },
    } as unknown as DragEvent;

    component.fileDrop(mockDragEvent);

    expect(mockDragEvent.preventDefault).toHaveBeenCalled();
    expect(component.inputTitle()).toBe('contacts.csv');
    expect(component.form()?.get('contacts')?.value).toBe(mockFile);
  });

  it('should not update inputTitle when dropped without a file', () => {
    const initialTitle = component.inputTitle();
    const mockDragEvent = {
      preventDefault: jest.fn(),
      dataTransfer: { files: { item: (): null => null } },
    } as unknown as DragEvent;

    component.fileDrop(mockDragEvent);

    expect(component.inputTitle()).toBe(initialTitle);
  });

  it('should not update inputTitle when dataTransfer is null', () => {
    const initialTitle = component.inputTitle();
    const mockDragEvent = {
      preventDefault: jest.fn(),
      dataTransfer: null,
    } as unknown as DragEvent;

    component.fileDrop(mockDragEvent);

    expect(component.inputTitle()).toBe(initialTitle);
  });

  it('should prevent default on dragover', () => {
    const mockDragEvent = {
      preventDefault: jest.fn(),
    } as unknown as DragEvent;

    component.onDragOver(mockDragEvent);

    expect(mockDragEvent.preventDefault).toHaveBeenCalled();
  });

  it('should update inputTitle and contacts value when file is selected via input', () => {
    const mockFile = new File(['content'], 'contacts.xlsx', { type: 'application/vnd.ms-excel' });
    const fileInputEl = component.fileInput()?.nativeElement;

    Object.defineProperty(fileInputEl, 'files', {
      value: { item: (): File => mockFile },
      configurable: true,
    });

    component.onFileInputChange();

    expect(component.inputTitle()).toBe('contacts.xlsx');
    expect(component.form()?.get('contacts')?.value).toBe(mockFile);
  });

  it('should not update inputTitle when file input has no file', () => {
    const initialTitle = component.inputTitle();
    const fileInputEl = component.fileInput()?.nativeElement;

    Object.defineProperty(fileInputEl, 'files', {
      value: { item: (): null => null },
      configurable: true,
    });

    component.onFileInputChange();

    expect(component.inputTitle()).toBe(initialTitle);
  });

  it('should call click on fileInput when onUploadClick is called', () => {
    const fileInputEl = component.fileInput()?.nativeElement;
    jest.spyOn(fileInputEl, 'click').mockImplementation(() => undefined);

    component.onUploadClick();

    expect(fileInputEl.click).toHaveBeenCalled();
  });

  describe('dispatchValidation', () => {
    it('should dispatch validateCampaign when templateId is set and file is dropped', () => {
      fixture.componentRef.setInput('templateId', 'tpl-1');
      fixture.componentRef.setInput('templateVariables', '{"name":"test"}');

      const mockFile = new File(['content'], 'contacts.csv', { type: 'text/csv' });
      const mockDragEvent = {
        preventDefault: jest.fn(),
        dataTransfer: { files: { item: (): File => mockFile } },
      } as unknown as DragEvent;

      component.fileDrop(mockDragEvent);

      expect(store.dispatch).toHaveBeenCalledWith(
        CreationActions.validateCampaign({
          template_id: 'tpl-1',
          file: mockFile,
          template_variables: '{"name":"test"}',
        }),
      );
    });

    it('should dispatch validateCampaign when templateId is set and file is selected via input', () => {
      fixture.componentRef.setInput('templateId', 'tpl-2');

      const mockFile = new File(['content'], 'contacts.xlsx');
      const fileInputEl = component.fileInput()?.nativeElement;

      Object.defineProperty(fileInputEl, 'files', {
        value: { item: (): File => mockFile },
        configurable: true,
      });

      component.onFileInputChange();

      expect(store.dispatch).toHaveBeenCalledWith(
        CreationActions.validateCampaign({ template_id: 'tpl-2', file: mockFile, template_variables: undefined }),
      );
    });

    it('should not dispatch validateCampaign when templateId is not set', () => {
      const mockFile = new File(['content'], 'contacts.csv', { type: 'text/csv' });
      const mockDragEvent = {
        preventDefault: jest.fn(),
        dataTransfer: { files: { item: (): File => mockFile } },
      } as unknown as DragEvent;

      store.dispatch.mockClear();
      component.fileDrop(mockDragEvent);

      expect(store.dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: '[Push Manager - Creation] Validate Campaign' }),
      );
    });
  });

  describe('invalidRows', () => {
    it('should return empty array when validationResult is null', () => {
      expect(component.invalidRows()).toEqual([]);
    });

    it('should return invalid_rows_preview from store validation result', () => {
      const mockRows = [{ row: 2, name: 'John', phone: '5511999999999' }];

      store.setState({
        'pm-creation': {
          ...creationInitialState,
          validationResult: {
            ...({} as any),
            invalid_rows_preview: mockRows,
          },
        },
      });
      fixture.detectChanges();

      expect(component.invalidRows()).toEqual(mockRows);
    });
  });
});
