import { FormBuilder } from '@angular/forms';
import { FilterGroupConfig } from '../model/filter-group-config';
import { FilterGroupConnector } from '../model/filter-group-connector';
import { FilterGroupOperator } from '../model/filter-group-operator';
import { FilterGroupType } from '../model/filter-group-type';

import { ReportFilterDialogService } from './report-filter-dialog.service';

const mockOptions: FilterGroupConfig[] = [
  {
    value: 'firstOption',
    label: 'firstOption',
    type: FilterGroupType.SELECT,
    operators: [FilterGroupOperator.IT_IS, FilterGroupOperator.IS_NOT],
    options: [],
  },
  {
    value: 'secondOption',
    label: 'secondOption',
    type: FilterGroupType.DATE_RANGE,
    operators: [FilterGroupOperator.IT_IS, FilterGroupOperator.IS_NOT],
  },
];

describe('ReportFilterDialogService', () => {
  let service: ReportFilterDialogService;

  beforeEach(() => {
    service = new ReportFilterDialogService(new FormBuilder());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created with the initial filter', (done) => {
    const expectedFilter = {
      connector: FilterGroupConnector.WHERE,
      operator: FilterGroupOperator.IT_IS,
      selector: null,
      value: null,
    };

    service.filterForm$.subscribe((filter) => {
      const filterGroup = filter.controls.filters.at(0);
      expect(filterGroup.getRawValue()).toEqual(expectedFilter);
      expect(filterGroup.get('connector').disabled).toBe(true);
      done();
    });
  });

  it('should set the options', (done) => {
    service.setOptions(mockOptions);

    service.selectors$.subscribe((selectors) => {
      expect(selectors).toEqual(mockOptions);

      done();
    });
  });

  it('should be add a new filter group', (done) => {
    service.addFilterGroup();

    service.filterForm$.subscribe((filter) => {
      expect(filter.controls['filters'].length).toEqual(2);

      done();
    });
  });

  describe('removeFilterGroup', () => {
    it('should remove a filter group by index', (done) => {
      service.removeFilterGroup(0);

      service.filterForm$.subscribe((filter) => {
        expect(filter.controls['filters'].length).toEqual(0);

        done();
      });
    });

    it('should set the inUse property of the filterGroup selector as false', (done) => {
      const mockOption: FilterGroupConfig = {
        value: 'firstOption',
        label: 'firstOption',
        type: FilterGroupType.SELECT,
        operators: [FilterGroupOperator.IT_IS, FilterGroupOperator.IS_NOT],
        options: [],
      };
      service.setOptions([mockOption]);

      service.groupSelectorChanged(0, 'firstOption', null);
      service.removeFilterGroup(0, 'firstOption');

      service.selectors$.subscribe((selectors) => {
        expect(selectors[0].inUse).toEqual(false);

        done();
      });
    });
  });

  it('should return the filter value', (done) => {
    const expectedFilter = [
      {
        connector: FilterGroupConnector.WHERE,
        operator: FilterGroupOperator.IT_IS,
        selector: 'mock_selector',
        value: 'mock_value',
      },
    ];
    service.setOptions(mockOptions);

    service.filterForm$.subscribe((filter) => {
      filter.controls['filters'].at(0).patchValue({ value: 'mock_value', selector: 'mock_selector' });

      expect(service.getFilterValue()).toEqual(expectedFilter);
      done();
    });
  });

  it('should reset the filter', (done) => {
    const expectedFilter = {
      filters: [
        {
          connector: FilterGroupConnector.WHERE,
          operator: FilterGroupOperator.IT_IS,
          selector: null,
          value: null,
        },
      ],
    };

    service.setOptions(mockOptions);
    service.clearFilters();

    service.filterForm$.subscribe((filter) => {
      expect(filter.getRawValue()).toEqual(expectedFilter);
      done();
    });
  });

  describe('groupSelectorChanged', () => {
    beforeEach(() => {
      service.setOptions(mockOptions);
    });

    it('should return the next FilterGroupConfig', () => {
      const expectedConfig = mockOptions[1];

      const result = service.groupSelectorChanged(0, 'secondOption', null);
      expect(result).toEqual(expectedConfig);
    });

    it('should update the inUse property of the selectors', (done) => {
      service.groupSelectorChanged(0, 'firstOption', null);
      service.groupSelectorChanged(0, 'secondOption', mockOptions[0]);

      service.selectors$.subscribe((selectors) => {
        expect(selectors[0].inUse).toBe(false);
        done();
      });
    });

    it('should update the value formControl in the formGroup', (done) => {
      const expecteValue = { end: null, start: null };
      service.groupSelectorChanged(0, 'secondOption', null);

      service.filterForm$.subscribe((form) => {
        expect(form.controls.filters.at(0).controls.value.getRawValue()).toEqual(expecteValue);
        done();
      });
    });
  });
});
