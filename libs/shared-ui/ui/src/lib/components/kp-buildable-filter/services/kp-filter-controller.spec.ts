import { KpFilterControllerState, KpFilterOption } from '../models';
import { KpFilterController } from './kp-filter-controller';
import { KpFilterDefDirective } from '../directives';
import { zip } from 'rxjs';

const mockDefinitions: KpFilterOption[] = [
  { filterKey: 'name', type: 'search', label: 'name' },
  {
    filterKey: 'mission',
    type: 'search',
    label: 'mission',
  },
  { filterKey: 'pulse', type: 'search', label: 'pulse' },
  {
    filterKey: 'channel',
    type: 'search',
    label: 'channel',
  },
  {
    filterKey: 'start_date',
    type: 'dateRange',
    label: 'start',
    rangeConfig: { fromKey: 'startDateFrom', toKey: 'startDateTo' },
  },
  {
    filterKey: 'manager',
    type: 'search',
    label: 'manager',
    disabled: true,
  },
];

describe('KpFilterController', () => {
  let controller: KpFilterController;

  beforeEach(() => {
    controller = new KpFilterController();
    controller.buildOptions(mockDefinitions);
  });

  it('should create a new instance', () => {
    expect(controller).toBeTruthy();
  });

  describe('availableOptions$', () => {
    it('should return the available options', (done) => {
      const expectedOptions: KpFilterOption[] = [
        { filterKey: 'name', type: 'search', label: 'name' },
        {
          filterKey: 'mission',
          type: 'search',
          label: 'mission',
        },
        { filterKey: 'pulse', type: 'search', label: 'pulse' },
        {
          filterKey: 'channel',
          type: 'search',
          label: 'channel',
        },
        {
          filterKey: 'start_date',
          type: 'dateRange',
          label: 'start',
          rangeConfig: { fromKey: 'startDateFrom', toKey: 'startDateTo' },
        },
      ];

      controller.availableOptions$.subscribe((options) => {
        expect(options).toMatchObject(expectedOptions);
        done();
      });
    });
  });

  describe('selectedOptions$', () => {
    it('should return the selected options', (done) => {
      const expectedOptions: KpFilterOption[] = [{ filterKey: 'name', type: 'search', label: 'name', selected: true }];

      controller.toggleOptionSelection('name');

      controller.selectedOptions$.subscribe((options) => {
        expect(options).toEqual(expect.arrayContaining(expectedOptions));
        done();
      });
    });
  });

  describe('toggleOptionSelection', () => {
    it('should toggle an options selected status, removing it from the available options', (done) => {
      const expectedOptions: KpFilterOption[] = [{ filterKey: 'name', type: 'search', label: 'name' }];

      controller.toggleOptionSelection('mission');

      controller.availableOptions$.subscribe((options) => {
        expect(options.length).toBe(4);
        expect(options).toEqual(expect.arrayContaining(expectedOptions));
        done();
      });
    });
  });

  describe('swapSelectedOptions', () => {
    it('should swap two options selection status', (done) => {
      const expectedOptions: KpFilterOption[] = [
        { filterKey: 'mission', type: 'search', label: 'mission', selected: true },
        {
          filterKey: 'pulse',
          type: 'search',
          label: 'pulse',
          selected: true,
        },
        { filterKey: 'name', type: 'search', label: 'name', selected: true },
      ];
      controller.toggleOptionSelection('mission');
      controller.toggleOptionSelection('channel');
      controller.toggleOptionSelection('name');

      controller.swapSelectedOptions({ previous: 'channel', current: 'pulse' });

      controller.selectedOptions$.subscribe((options) => {
        expect(options).toEqual(expect.arrayContaining(expectedOptions));
        done();
      });
    });

    it('should swap two options selection status setting the initial rangeType selection for one with the rangeConfig property', (done) => {
      const expectedOptions: KpFilterOption[] = [
        { filterKey: 'mission', type: 'search', label: 'mission', selected: true },
        {
          filterKey: 'start_date',
          type: 'dateRange',
          label: 'start',
          rangeConfig: { fromKey: 'startDateFrom', toKey: 'startDateTo' },
          selected: true,
          rangeType: 'equals',
        },
        { filterKey: 'name', type: 'search', label: 'name', selected: true },
      ];
      controller.toggleOptionSelection('mission');
      controller.toggleOptionSelection('channel');
      controller.toggleOptionSelection('name');

      controller.swapSelectedOptions({ previous: 'channel', current: 'start_date' });

      controller.selectedOptions$.subscribe((options) => {
        expect(options).toEqual(expect.arrayContaining(expectedOptions));
        done();
      });
    });

    it('should restore the previous option selection status as false', (done) => {
      const expectedOptions: KpFilterOption[] = [
        {
          filterKey: 'channel',
          type: 'search',
          label: 'channel',
          selected: false,
        },
      ];
      controller.toggleOptionSelection('mission');
      controller.toggleOptionSelection('channel');
      controller.toggleOptionSelection('name');

      controller.swapSelectedOptions({ previous: 'channel', current: 'pulse' });

      controller.availableOptions$.subscribe((options) => {
        expect(options).toEqual(expect.arrayContaining(expectedOptions));
        done();
      });
    });
  });

  describe('resetSelection', () => {
    it('should set the selected property of each option as false', (done) => {
      const expectedOptions: KpFilterOption[] = [
        { filterKey: 'name', type: 'search', label: 'name', selected: false },
        {
          filterKey: 'mission',
          type: 'search',
          label: 'mission',
          selected: false,
        },
      ];

      controller.toggleOptionSelection('name');
      controller.toggleOptionSelection('mission');

      controller.resetSelection();

      controller.availableOptions$.subscribe((options) => {
        expect(options.length).toBe(5);
        expect(options).toEqual(expect.arrayContaining(expectedOptions));
        done();
      });
    });
  });

  describe('readDefinition', () => {
    it('should return an filter definition by its filterKey', () => {
      const expectedDefinition: KpFilterOption = { filterKey: 'name', type: 'search', label: 'name' };

      expect(controller.readDefinition('name')).toMatchObject(expectedDefinition);
    });
  });

  describe('setDefaultDirectives', () => {
    it('should store default directives templates', () => {
      const mockDirective: KpFilterDefDirective = { kpFilterDef: 'search' } as unknown as KpFilterDefDirective;
      const mockFilterDef: KpFilterOption = { filterKey: 'name', type: 'search' } as unknown as KpFilterOption;

      controller.setDefaultDirectives([mockDirective]);

      expect(controller.getDirectiveForRendering(mockFilterDef)).toEqual(mockDirective);
    });
  });

  describe('setCustomDirectives', () => {
    it('should store custom directives templates', () => {
      const mockDirective: KpFilterDefDirective = { kpFilterDef: 'name' } as unknown as KpFilterDefDirective;
      const mockFilterDef: KpFilterOption = { filterKey: 'name', customTemplate: 'name' } as unknown as KpFilterOption;

      controller.setCustomDirectives([mockDirective]);

      expect(controller.getDirectiveForRendering(mockFilterDef)).toEqual(mockDirective);
    });
  });

  describe('setOptionRangeType', () => {
    it('should update an selected option rangeType param', (done) => {
      controller.toggleOptionSelection('name');
      controller.setOptionRangeType('name', 'between');
      const expectedOptions: KpFilterOption[] = [
        {
          filterKey: 'name',
          type: 'search',
          label: 'name',
          selected: true,
          rangeType: 'between',
        },
      ];

      controller.selectedOptions$.subscribe((options) => {
        expect(options).toEqual(expect.arrayContaining(expectedOptions));
        done();
      });
    });
  });

  describe('controllerState', () => {
    const mockOptionsMap: KpFilterOption[] = [
      { filterKey: 'name', type: 'search', label: 'name', selected: true },
      {
        filterKey: 'mission',
        type: 'search',
        label: 'mission',
      },
      { filterKey: 'pulse', type: 'search', label: 'pulse' },
      {
        filterKey: 'channel',
        type: 'search',
        label: 'channel',
        selected: true,
      },
      {
        filterKey: 'start_date',
        type: 'dateRange',
        label: 'start',
        rangeConfig: { fromKey: 'startDateFrom', toKey: 'startDateTo' },
      },
    ];

    const mockSelectedOptions: KpFilterOption[] = [
      { filterKey: 'name', type: 'search', label: 'name', selected: true },
      {
        filterKey: 'channel',
        type: 'search',
        label: 'channel',
        selected: true,
        rangeType: 'between',
      },
    ];

    describe('getControllerState', () => {
      it('should return the current controller state', () => {
        controller.toggleOptionSelection('name');
        controller.toggleOptionSelection('channel');
        controller.setOptionRangeType('channel', 'between');

        const expectedState: KpFilterControllerState = {
          options: mockOptionsMap,
          selectedOptions: mockSelectedOptions,
        };

        const state = controller.getControllerState();

        expect(state).toMatchObject(expectedState);
      });
    });

    describe('restoreControllerState', () => {
      it('should restore the available and selected options', (done) => {
        const mockAvailableOptions: KpFilterOption[] = [
          {
            filterKey: 'mission',
            type: 'search',
            label: 'mission',
          },
          { filterKey: 'pulse', type: 'search', label: 'pulse' },
        ];

        const mockState: KpFilterControllerState = {
          options: mockOptionsMap,
          selectedOptions: mockSelectedOptions,
        };

        controller.restoreControllerState(mockState);

        zip(controller.selectedOptions$, controller.availableOptions$).subscribe((restoredState) => {
          expect(restoredState.at(0)).toEqual(expect.arrayContaining(mockSelectedOptions));
          expect(restoredState.at(1)).toEqual(expect.arrayContaining(mockAvailableOptions));

          done();
        });
      });
    });
  });

  describe('getDirectiveForRendering', () => {
    it('should return a default directive using the filterDef type property', () => {
      const mockDefaultDirective: KpFilterDefDirective = { kpFilterDef: 'search' } as unknown as KpFilterDefDirective;
      const mockCustomDirective: KpFilterDefDirective = { kpFilterDef: 'age' } as unknown as KpFilterDefDirective;
      const mockDefaultFilterDef: KpFilterOption = { filterKey: 'name', type: 'search' } as unknown as KpFilterOption;

      controller.setDefaultDirectives([mockDefaultDirective]);
      controller.setCustomDirectives([mockCustomDirective]);

      expect(controller.getDirectiveForRendering(mockDefaultFilterDef)).toEqual(mockDefaultDirective);
    });

    it('should return a custom directive if customTemplate is set on the kpFilterDef', () => {
      const mockDefaultDirective: KpFilterDefDirective = { kpFilterDef: 'name' } as unknown as KpFilterDefDirective;
      const mockCustomDirective: KpFilterDefDirective = { kpFilterDef: 'search' } as unknown as KpFilterDefDirective;
      const mockCustomFilterDef: KpFilterOption = {
        filterKey: 'search',
        customTemplate: 'search',
      } as unknown as KpFilterOption;

      controller.setDefaultDirectives([mockDefaultDirective]);
      controller.setCustomDirectives([mockCustomDirective]);

      expect(controller.getDirectiveForRendering(mockCustomFilterDef)).toEqual(mockCustomDirective);
    });
  });
});
