import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';
import { KpFilterDefDirective } from '../../directives';
import { KpFilterOption, KpFilterOptionSwap } from '../../models';
import { KpFilterController } from '../../services';
import { KpFilterOptionComponent, RangeTypeSelectOption } from './kp-filter-option.component';

describe('KpFilterOptionComponent', () => {
  let component: KpFilterOptionComponent;
  let fixture: ComponentFixture<KpFilterOptionComponent>;
  let filterControllerMock: jest.Mocked<KpFilterController>;

  const mockFilterOption: KpFilterOption = { filterKey: 'name', type: 'search', label: 'name' };
  const mockAvailableOptions: KpFilterOption[] = [mockFilterOption];

  const mockDirective: jest.Mocked<KpFilterDefDirective> = {
    registerAndRender: jest.fn(),
    unregisterAndMarkForCheck: jest.fn(),
  } as unknown as jest.Mocked<KpFilterDefDirective>;

  beforeEach(async () => {
    filterControllerMock = {
      getDirectiveForRendering: jest.fn(() => mockDirective),
    } as unknown as jest.Mocked<KpFilterController>;

    await TestBed.configureTestingModule({
      imports: [KpFilterOptionComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [{ provide: KpFilterController, useValue: filterControllerMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpFilterOptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('availableOptions', mockAvailableOptions);
    fixture.componentRef.setInput('selectedOption', mockFilterOption);

    fixture.detectChanges();
  });

  describe('onSelectionChange', () => {
    it('should emit the option selected event', () => {
      const emitSpy = jest.spyOn(component.optionSelected, 'emit');
      const expectedEvent: KpFilterOptionSwap = { previous: 'name', current: 'newFilterKey' };

      component.onSelectionChange('newFilterKey');

      expect(emitSpy).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('ngOnInit', () => {
    it('should filter the default range types available', () => {
      const mockOption: KpFilterOption = {
        filterKey: 'startDate',
        type: 'dateRange',
        label: 'Data de início',
        rangeConfig: { fromKey: 'dateFrom', toKey: 'dateTo' },
        rangeOptions: ['less', 'equals'],
      };
      const expectedRangeOptions: RangeTypeSelectOption[] = [
        { label: 'UI.KP_FILTER.PLACEHOLDERS.RANGE_EQUALS', value: 'equals' },
        { label: 'UI.KP_FILTER.PLACEHOLDERS.RANGE_LESS', value: 'less' },
      ];

      fixture.componentRef.setInput('selectedOption', mockOption);
      component.ngOnInit();

      expect(component.rangeTypes).toMatchObject(expectedRangeOptions);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should call registerAndRender on the related KpFilterDefDirective with the current selected option', () => {
      component.ngAfterViewInit();

      expect(mockDirective.registerAndRender).toHaveBeenCalledWith(expect.anything(), mockFilterOption);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unregisterAndDestroy on the relate KpFilterDefDirective', () => {
      component.ngOnDestroy();

      expect(mockDirective.unregisterAndMarkForCheck).toHaveBeenCalled();
    });
  });

  describe('removeOption', () => {
    it('should emit the remove event', () => {
      const emitSpy = jest.spyOn(component.remove, 'emit');

      component.removeOption();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
