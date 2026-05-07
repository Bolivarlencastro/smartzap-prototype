import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';
import { KpAutocompleteOption } from '../../models';
import { KpAutocompleteFilterService } from '../../services';
import { KpAutocompleteComponent } from './kp-autocomplete.component';

describe('KpAutocompleteComponent', () => {
  let component: KpAutocompleteComponent;
  let fixture: ComponentFixture<KpAutocompleteComponent>;
  let autocompleteFilterMock: jest.Mocked<KpAutocompleteFilterService>;
  const options: KpAutocompleteOption[] = [
    { value: 'mock_id', label: 'Option #1' },
    { value: 'mock_id_2', label: 'Option #2' },
  ];

  const formGroupMock = new FormGroupDirective([], []);

  beforeEach(async () => {
    formGroupMock.form = new FormGroup({
      value: new FormControl([]),
    });

    autocompleteFilterMock = {
      setOptions: jest.fn(),
      options: of([]),
      triggerValue: of(''),
      selectionChange: jest.fn(),
      getFilteredOptions: jest.fn(() => options),
      filterOptions: jest.fn(),
    } as unknown as jest.Mocked<KpAutocompleteFilterService>;

    await TestBed.configureTestingModule({
      imports: [KpAutocompleteComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: FormGroupDirective,
          useValue: formGroupMock,
        },
      ],
    })
      .overrideComponent(KpAutocompleteComponent, {
        set: {
          providers: [
            {
              provide: KpAutocompleteFilterService,
              useValue: autocompleteFilterMock,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(KpAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('acFormControlName', 'value');
    fixture.componentRef.setInput('options', options);

    fixture.detectChanges();
  });

  describe('set options', () => {
    it('should call setOptions on the autocomplete service', () => {
      component.options = options;

      expect(autocompleteFilterMock.setOptions).toHaveBeenCalledWith(options);
    });
  });

  describe('ngOnInit', () => {
    it('should call selectionChange with the formControl value', () => {
      component.ngOnInit();

      expect(autocompleteFilterMock.selectionChange).toHaveBeenCalledWith(expect.arrayContaining([]));
    });
  });

  describe('selectAll', () => {
    it('should set the formControl value with the available options values', () => {
      component.selectAll();

      expect(formGroupMock.form.get('value').value).toEqual(expect.arrayContaining(['mock_id', 'mock_id_2']));
    });
  });

  describe('clearSelection', () => {
    it('should set the formControl value an empty array', () => {
      component.selectAll();
      component.clearSelection();

      expect(formGroupMock.form.get('value').value).toEqual(expect.arrayContaining([]));
    });
  });

  describe('onFilter', () => {
    it('should call filterOptions', () => {
      component.onFilter('mock_filter');

      expect(autocompleteFilterMock.filterOptions).toHaveBeenCalledWith('mock_filter');
    });
  });

  describe('selectionChange', () => {
    it('should call selection change on the component', () => {
      const expectedValue = ['mock_id_1', 'mock_id_2'];

      component.selectionChange(expectedValue);

      expect(autocompleteFilterMock.selectionChange).toHaveBeenCalledWith(expectedValue);
    });
  });
});
