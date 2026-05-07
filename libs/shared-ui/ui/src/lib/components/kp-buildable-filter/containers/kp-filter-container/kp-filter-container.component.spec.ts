import { CUSTOM_ELEMENTS_SCHEMA, QueryList } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ControlContainer, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';
import { KpFilterDefDirective } from '../../directives';
import { KpFilterControllerState, KpFilterOption, KpFilterOptionSwap } from '../../models';
import { KpFilterController } from '../../services';
import { KpFilterContainerComponent } from './kp-filter-container.component';

describe('KpFilterContainerComponent', () => {
  let component: KpFilterContainerComponent;
  let fixture: ComponentFixture<KpFilterContainerComponent>;
  let filterControllerMock: jest.Mocked<KpFilterController>;
  const mockCustomDirectives: KpFilterDefDirective[] = [];
  const mockDefaultDirectives: KpFilterDefDirective[] = [];
  const mockFilterDef: KpFilterOption[] = [];
  let formGroupMock: jest.Mocked<FormGroup>;

  const mockDefaultDirectivesQueryList: jest.Mocked<QueryList<KpFilterDefDirective>> = {
    toArray: jest.fn(() => mockDefaultDirectives),
  } as unknown as jest.Mocked<QueryList<KpFilterDefDirective>>;

  const mockCustomDirectivesQueryList: jest.Mocked<QueryList<KpFilterDefDirective>> = {
    toArray: jest.fn(() => mockCustomDirectives),
  } as unknown as jest.Mocked<QueryList<KpFilterDefDirective>>;

  beforeEach(async () => {
    filterControllerMock = {
      availableOptions$: of([]),
      selectedOptions$: of([]),
      buildOptions: jest.fn(),
      setDefaultDirectives: jest.fn(),
      setCustomDirectives: jest.fn(),
      toggleOptionSelection: jest.fn(),
      swapSelectedOptions: jest.fn(),
      setOptionRangeType: jest.fn(),
      restoreControllerState: jest.fn(),
    } as unknown as jest.Mocked<KpFilterController>;

    formGroupMock = {
      addControl: jest.fn(),
      removeControl: jest.fn(),
      patchValue: jest.fn(),
    } as unknown as jest.Mocked<FormGroup>;

    await TestBed.configureTestingModule({
      imports: [KpFilterContainerComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(KpFilterContainerComponent, {
        set: {
          providers: [
            {
              provide: KpFilterController,
              useValue: filterControllerMock,
            },
          ],
          viewProviders: [
            {
              provide: ControlContainer,
              useValue: { control: formGroupMock },
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(KpFilterContainerComponent);
    component = fixture.componentInstance;
    component.filterOptions = mockFilterDef;

    fixture.detectChanges();
  });

  describe('ngAfterViewInit', () => {
    it('should set the default directives on the filterController', () => {
      component.defaultDirectives = mockDefaultDirectivesQueryList;

      component.ngAfterViewInit();

      expect(filterControllerMock.setDefaultDirectives).toHaveBeenCalledWith(mockDefaultDirectives);
    });

    it('should set the custom directives on the filterController', () => {
      component.customDirectives = mockCustomDirectivesQueryList;
      component.ngAfterViewInit();

      expect(filterControllerMock.setCustomDirectives).toHaveBeenCalledWith(mockCustomDirectives);
    });

    it('should call buildOptions on the filterController if no initialControllerState is present', () => {
      component.ngAfterViewInit();

      expect(filterControllerMock.buildOptions).toHaveBeenCalledWith(mockFilterDef);
    });

    it('should call restoreControllerState on the filterController if initialControllerState is defined', () => {
      const mockInitialState: KpFilterControllerState = {
        options: [{ filterKey: 'mock_filter', label: 'mock_label', type: 'search' }],
        selectedOptions: [{ filterKey: 'mock_filter', label: 'mock_label', type: 'search' }],
      };
      component.initialControllerState = mockInitialState;
      component.ngAfterViewInit();

      expect(filterControllerMock.restoreControllerState).toHaveBeenCalledWith(mockInitialState);
    });

    it('should call patchValue on the container formGroup if the initialControlState is defined', fakeAsync(() => {
      component.initialControllerState = {
        options: [{ filterKey: 'mock_filter', label: 'mock_label', type: 'search' }],
        selectedOptions: [{ filterKey: 'mock_filter', label: 'mock_label', type: 'search' }],
      };
      const mockFilterValue = { name: 'mockName' };
      component.initialFilterValue = mockFilterValue;

      component.ngAfterViewInit();
      tick(1);

      expect(formGroupMock.patchValue).toHaveBeenCalledWith(mockFilterValue);
    }));
  });

  describe('onSelectionChange', () => {
    it('should call toggleOptionSelection on the filterController', () => {
      component.onSelectionChange('mockFilterKey');

      expect(filterControllerMock.toggleOptionSelection).toHaveBeenCalledWith('mockFilterKey');
    });

    it('should change displayOptionSelect to false', () => {
      component.onSelectionChange('mockFilterKey');

      expect(component.displayOptionSelect).toBe(false);
    });
  });

  describe('swapOptions', () => {
    it('should call swapSelectedOptions on the filterController', () => {
      const mockEvent: KpFilterOptionSwap = { previous: 'previous', current: 'current' };
      component.swapOptions(mockEvent);

      expect(filterControllerMock.swapSelectedOptions).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('addNewOption', () => {
    it('should change displayOptionSelect to true', () => {
      component.addNewOption();

      expect(component.displayOptionSelect).toBe(true);
    });
  });

  describe('removeOption', () => {
    it('should call toggleOptionSelection on the controller', () => {
      component.removeOption('mockFilterKey');

      expect(filterControllerMock.toggleOptionSelection).toHaveBeenCalledWith('mockFilterKey');
    });
  });

  describe('rangeChange', () => {
    it('should call setOptionRangeType on the controller', () => {
      component.rangeChange('mockFilterKey', 'between');

      expect(filterControllerMock.setOptionRangeType).toHaveBeenCalledWith('mockFilterKey', 'between');
    });
  });
});
