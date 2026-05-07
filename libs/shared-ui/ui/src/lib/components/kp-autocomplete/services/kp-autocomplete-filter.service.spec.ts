import { KpAutocompleteFilterService } from './kp-autocomplete-filter.service';
import { KpAutocompleteOption } from '../models';

describe('KpAutocompleteFilterService', () => {
  let service: KpAutocompleteFilterService;
  const options: KpAutocompleteOption[] = [
    { value: 'mock_id', label: 'Option #1' },
    { value: 'mock_id_2', label: 'Option #2' },
  ];

  beforeEach(() => {
    service = new KpAutocompleteFilterService();
    service.setOptions(options);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setOptions', () => {
    it('should set the available options', (done) => {
      service.options.subscribe((availableOptions) => {
        expect(availableOptions).toEqual(expect.arrayContaining(options));

        done();
      });
    });
  });

  describe('filterOptions', () => {
    it('should filter the available options', (done) => {
      service.filterOptions('option #1');

      service.options.subscribe((availableOptions) => {
        expect(availableOptions).toEqual(expect.arrayContaining([{ value: 'mock_id', label: 'Option #1' }]));

        done();
      });
    });

    it('should filter all available options when no filter is provided', (done) => {
      service.filterOptions('option #1');
      service.filterOptions();

      service.options.subscribe((availableOptions) => {
        expect(availableOptions).toEqual(expect.arrayContaining(options));

        done();
      });
    });
  });

  describe('selectionChange', () => {
    it('should update the trigger label value', (done) => {
      service.selectionChange(['mock_id']);

      service.triggerValue.subscribe((triggerValue) => {
        expect(triggerValue).toBe('Option #1');

        done();
      });
    });
  });
});
