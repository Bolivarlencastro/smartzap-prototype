import { PresentialLiveFormBuilder } from './presential-live-form-builder';
import { FormBuilder } from '@angular/forms';
import { MissionInformationDate } from 'app/main/mission/mission.model';

type DatesFormStructure = Partial<{
  start_at: string;
  date: string;
  end_at: string;
  touched: boolean;
  deleted: boolean;
  id: string;
}>;

type PresentialLiveFormStructure = Partial<{
  seats: number;
  address?: string;
  url?: string;
  dates: DatesFormStructure[];
}>;

describe('PresentialLiveDateForm', () => {
  const formBuilder = new FormBuilder();
  let presentialLiveFormBuilder: PresentialLiveFormBuilder;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('01 Jul 2023 08:00:00 GMT-0300'));
    presentialLiveFormBuilder = new PresentialLiveFormBuilder(formBuilder);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('buildDateFormGroup', () => {
    it('should create a new date formGroup', () => {
      const expectedFormValue: DatesFormStructure = {
        date: '2023-07-01',
        start_at: '09:00',
        end_at: '10:00',
        deleted: false,
        touched: true,
        id: null,
      };

      const formGroup = presentialLiveFormBuilder.buildDateFormGroup();

      expect(formGroup.value).toMatchObject(expectedFormValue);
    });

    it('should create a new formGroup with the next day date', () => {
      const expectedFormValue: DatesFormStructure = {
        date: '2023-07-02',
        start_at: '09:00',
        end_at: '10:00',
        deleted: false,
        touched: true,
        id: null,
      };

      const formGroup = presentialLiveFormBuilder.buildDateFormGroup(undefined, true);

      expect(formGroup.value).toMatchObject(expectedFormValue);
    });

    it('should create a new date formGroup from an initial value', () => {
      const initialValue: MissionInformationDate = {
        start_at: '2023-07-03T17:00:00-03:00',
        end_at: '2023-07-03T18:00:00-03:00',
        date: '2023-07-03T00:00:00',
        id: 'mock_id',
      };
      const expectedFormValue: DatesFormStructure = {
        date: '2023-07-03',
        start_at: '17:00',
        end_at: '18:00',
        deleted: false,
        touched: false,
        id: 'mock_id',
      };

      const formGroup = presentialLiveFormBuilder.buildDateFormGroup(initialValue);

      expect(formGroup.value).toMatchObject(expectedFormValue);
    });
  });

  describe('buildDatesArrayFromInitialValue', () => {
    const initialValue: MissionInformationDate[] = [
      {
        start_at: '2023-06-25T17:00:00-03:00',
        end_at: '2023-06-25T18:00:00-03:00',
        date: '2023-06-25T00:00:00',
        id: 'mock_id',
      },
      {
        start_at: '2023-07-04T17:00:00-03:00',
        end_at: '2023-07-04T18:00:00-03:00',
        date: '2023-07-04T00:00:00',
        id: 'mock_id',
      },
    ];

    const expectedValue: DatesFormStructure[] = [
      {
        date: '2023-06-25',
        start_at: '17:00',
        end_at: '18:00',
        deleted: false,
        touched: false,
        id: 'mock_id',
      },
      {
        date: '2023-07-04',
        start_at: '17:00',
        end_at: '18:00',
        deleted: false,
        touched: false,
        id: 'mock_id',
      },
    ];

    it('should build a form array with a dateFormGroup for each item in the initial value', () => {
      const formArray = presentialLiveFormBuilder.buildDatesArrayFromInitialValue(initialValue);

      expect(formArray.value).toMatchObject(expectedValue);
    });
  });

  describe('buildInitialForm', () => {
    it('should build an initial formGroup', () => {
      const initialDatesFormValue: DatesFormStructure = {
        date: '2023-07-01',
        start_at: '09:00',
        end_at: '10:00',
        deleted: false,
        touched: true,
        id: null,
      };

      const expectedValue: PresentialLiveFormStructure = {
        address: '',
        dates: [initialDatesFormValue],
      };

      const initialForm = presentialLiveFormBuilder.buildInitialForm();

      expect(initialForm.value).toMatchObject(expectedValue);
    });
  });
});
