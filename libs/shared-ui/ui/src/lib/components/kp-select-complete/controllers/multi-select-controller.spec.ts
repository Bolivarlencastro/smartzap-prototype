import { MultiSelectController } from './multi-select-controller';
import { KpSelectCompleteOption } from '../models';
import { Chance } from 'chance';

describe('MultiSelectController', () => {
  let controller: MultiSelectController;
  const chance = new Chance();

  beforeEach(() => {
    controller = new MultiSelectController();
  });

  it('should select the corresponding options using their values', () => {
    const optionsValues = [chance.guid(), chance.guid(), chance.guid()];
    const options: KpSelectCompleteOption[] = [
      {
        label: chance.string(),
        value: optionsValues.at(0),
      },
      { label: chance.string(), value: optionsValues.at(1) },
      { label: 'Not selected option', value: 'not_selected' },
    ];

    controller.selectByValue(optionsValues, options);

    expect(controller.controlValue).toMatchObject([optionsValues.at(0), optionsValues.at(1)]);
  });

  it('should select the provided values', () => {
    const options: KpSelectCompleteOption[] = [
      {
        label: chance.string(),
        value: chance.guid(),
      },
      { label: chance.string(), value: chance.guid() },
    ];

    controller.select(options);

    expect(controller.currentSelection).toMatchObject(options);
  });

  describe('getDisplayOptions', () => {
    it('should return the current options including the already selected options in alphabetical order', () => {
      const selectedOption: KpSelectCompleteOption = { label: 'b_label', value: chance.guid() };
      const options: KpSelectCompleteOption[] = [
        {
          label: 'a_label',
          value: chance.guid(),
        },
        { label: 'c_label', value: chance.guid() },
      ];
      controller.select([selectedOption]);

      const expectedOptions = [options.at(0), selectedOption, options.at(1)];
      expect(controller.getDisplayOptions(options)).toMatchObject(expectedOptions);
    });
  });
});
