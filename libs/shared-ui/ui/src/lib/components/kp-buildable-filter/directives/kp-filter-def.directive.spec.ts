import { KpFilterDefDirective } from './kp-filter-def.directive';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { KpFilterOption } from '../models';
import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

describe('KpFilterDefDirective', () => {
  let formGroup: FormGroup;
  let directive: KpFilterDefDirective;

  const mockTemplateRef = {
    elementRef: {},
    createEmbeddedView: jest.fn(),
  } as unknown as jest.Mocked<TemplateRef<any>>;
  const mockFilterDefinition: KpFilterOption = { filterKey: 'name', type: 'search', label: 'name' };

  let mockEmbeddedViewResult: jest.Mocked<EmbeddedViewRef<any>>;
  let mockViewContainer: jest.Mocked<ViewContainerRef>;

  beforeEach(() => {
    formGroup = new FormGroup({});
    mockEmbeddedViewResult = { markForCheck: jest.fn() } as unknown as jest.Mocked<EmbeddedViewRef<any>>;
    mockViewContainer = {
      createEmbeddedView: jest.fn(() => mockEmbeddedViewResult),
    } as unknown as jest.Mocked<ViewContainerRef>;

    TestBed.configureTestingModule({
      providers: [{ provide: ControlContainer, useValue: { control: formGroup } }],
    });

    TestBed.runInInjectionContext(() => {
      directive = new KpFilterDefDirective(mockTemplateRef);
    });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('registerAndRender', () => {
    it('should register the formControl on the parent FormGroup', () => {
      const addControlSpy = jest.spyOn(formGroup, 'addControl');

      directive.registerAndRender(mockViewContainer, mockFilterDefinition);

      expect(addControlSpy).toHaveBeenCalledWith('name', expect.anything());
    });

    it('should register the formControl on the parent FormGroup with max and min length validators for selectMultiple types', () => {
      const selectMultipleOption: KpFilterOption = {
        filterKey: 'name',
        type: 'selectMultiple',
        label: 'name',
        selectionLengthConfig: { min: 2, max: 3 },
      };

      directive.registerAndRender(mockViewContainer, selectMultipleOption);
      formGroup.get('name').setValue(['1']);
      const hasMinError = formGroup.get('name').hasError('minlength');
      formGroup.get('name').setValue(['1', '2', '3', '4']);
      const haxMaxError = formGroup.get('name').hasError('maxlength');

      expect(hasMinError).toBe(true);
      expect(haxMaxError).toBe(true);
    });

    it('should call createEmbeddedView on the provided ViewContainerRef', () => {
      directive.registerAndRender(mockViewContainer, mockFilterDefinition);

      expect(mockViewContainer.createEmbeddedView).toHaveBeenCalledWith(mockTemplateRef, {
        $implicit: mockFilterDefinition,
        control: expect.any(FormControl),
      });
    });

    it('should emit register the valueChanges event emitter when the filterDef type is autocomplete', fakeAsync(() => {
      const emitSpy = jest.spyOn(directive.valueChanges, 'emit');
      const mockAutoCompleteDef: KpFilterOption = { filterKey: 'user', type: 'autoComplete', label: 'user' };

      directive.registerAndRender(mockViewContainer, mockAutoCompleteDef);
      formGroup.get('user').setValue('mockValue');

      tick(201);

      expect(emitSpy).toHaveBeenCalledWith('mockValue');
    }));
  });

  describe('unregisterAndDestroy', () => {
    it('should remove the formControl from the parent FormGroup', () => {
      const removeControlSpy = jest.spyOn(formGroup, 'removeControl');
      directive.registerAndRender(mockViewContainer, mockFilterDefinition);

      directive.unregisterAndMarkForCheck(['name']);

      expect(removeControlSpy).toHaveBeenCalledWith('name', { emitEvent: false });
    });

    it('should call markForCheck on the created contentView', () => {
      directive.registerAndRender(mockViewContainer, mockFilterDefinition);

      directive.unregisterAndMarkForCheck(['name']);

      expect(mockEmbeddedViewResult.markForCheck).toHaveBeenCalled();
    });
  });
});
