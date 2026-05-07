import { SingleSelectController } from './single-select-controller';
import { KpSelectCompleteOption } from '../models';

describe('SingleSelectController', () => {
  let controller: SingleSelectController;

  beforeEach(() => {
    controller = new SingleSelectController();
  });

  it('should write the corresponding value to the selection', () => {
    const expectedValue: KpSelectCompleteOption = { label: 'First option', value: 'mock_value_1' };
    const options: KpSelectCompleteOption[] = [expectedValue, { label: 'Second option', value: 'mock_value_2' }];

    controller.selectByValue('mock_value_1', options);

    expect(controller.currentSelection).toMatchObject(expectedValue);
  });

  it('should select an item', () => {
    const stubOption: KpSelectCompleteOption = { label: 'First option', value: 'mock_value_1' };
    controller.select(stubOption);

    expect(controller.currentSelection).toBe(stubOption);
  });

  it('should return the value of the current selection', () => {
    const stubOption: KpSelectCompleteOption = { label: 'First option', value: 'mock_value_1' };
    controller.select(stubOption);

    expect(controller.controlValue).toBe('mock_value_1');
  });
});
