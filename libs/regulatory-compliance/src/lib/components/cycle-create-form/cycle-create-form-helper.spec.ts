import { CycleCreateForm } from '../../models';
import { CycleCreateFormHelper } from './cycle-create-form-helper';
import { FormBuilder } from '@angular/forms';
import { CycleCreateDto, CycleDto, LearningObjectDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoService } from '@jsverse/transloco';

describe('CycleCreateFormHelper', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    formBuilder = new FormBuilder();
  });

  describe('buildForm', () => {
    it('should return the cycle creation form', () => {
      const expectedResultValue: CycleCreateForm = {
        duration: null,
        periodType: null,
        description: '',
        compliance: null,
        learningObject: null,
        jobIds: [],
        jobFunctionIds: [],
      };

      const result = CycleCreateFormHelper.buildForm(formBuilder);

      expect(result.getRawValue()).toEqual(expectedResultValue);
    });
  });

  describe('patchForm', () => {
    it('should not patch the form if the cycle is undefined', () => {
      const formGroup = CycleCreateFormHelper.buildForm(formBuilder);
      const patchSpy = jest.spyOn(formGroup, 'patchValue');

      CycleCreateFormHelper.patchForm(undefined, formGroup);

      expect(patchSpy).not.toHaveBeenCalled();
    });

    it('should patch the form with the provided cycle', () => {
      const formGroup = CycleCreateFormHelper.buildForm(formBuilder);
      const mockCycle: CycleDto = {
        id: 'mock_id',
        compliance: { id: 'mock_compliance_id', name: 'mock_compliance_name' },
        learningObject: { id: 'mock_learning_object_id', name: 'mock_learning_object_name' } as LearningObjectDto,
        description: 'mock_description',
        jobIds: ['mock_job'],
        jobFunctionIds: ['mock_job_function'],
        duration: 10,
        periodType: 'DAY',
        enrollmentsCount: null,
        createdDate: '',
        updatedDate: '',
      };

      const expectedFormValue: CycleCreateForm = {
        duration: 10,
        periodType: 'DAY',
        jobFunctionIds: ['mock_job_function'],
        jobIds: ['mock_job'],
        compliance: { value: 'mock_compliance_id', label: 'mock_compliance_name' },
        learningObject: { value: 'mock_learning_object_id', label: 'mock_learning_object_name' },
        description: 'mock_description',
      };

      CycleCreateFormHelper.patchForm(mockCycle, formGroup);

      expect(formGroup.getRawValue()).toMatchObject(expectedFormValue);
    });
  });

  describe('parseFormToCreateDTO', () => {
    it('should parse an CycleCrete object to the CycleCreateDTO object', () => {
      const formValue: CycleCreateForm = {
        duration: 10,
        jobFunctionIds: ['mock_job_function'],
        jobIds: ['mock_job'],
        compliance: { value: 'mock_compliance_id', label: 'mock_compliance_name' },
        learningObject: { value: 'mock_learn_object_id', label: 'mock_learning_object_name' },
        description: 'mock_description',
        periodType: 'DAY',
      };

      const expectedResult: CycleCreateDto = {
        duration: 10,
        jobFunctionIds: ['mock_job_function'],
        jobIds: ['mock_job'],
        complianceId: 'mock_compliance_id',
        learningObjectId: 'mock_learn_object_id',
        description: 'mock_description',
        periodType: 'DAY',
      };

      expect(CycleCreateFormHelper.parseFormToCreateDTO(formValue)).toMatchObject(expectedResult);
    });
  });

  describe('createDescription', () => {
    let translateServiceMock: jest.Mocked<TranslocoService>;

    beforeEach(() => {
      translateServiceMock = {
        translate: jest.fn((value, _interpolationParams?: any) => value),
      } as unknown as jest.Mocked<TranslocoService>;
    });

    it('should return the description for the cycle', () => {
      const formValue: CycleCreateForm = {
        duration: 10,
        jobFunctionIds: ['mock_job_function'],
        jobIds: ['mock_job'],
        compliance: { value: 'mock_compliance_id', label: 'mock_compliance_name' },
        learningObject: { value: 'mock_learn_object_id', label: 'mock_learn_object_name' },
        description: 'mock_description',
        periodType: 'DAY',
      };

      const expectedInterpolationParams = {
        compliance: 'mock_compliance_name',
        learningObjectType: 'REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.CONNECTED_MISSION',
        learningObjectName: 'mock_learn_object_name',
        duration: '10',
        periodType: 'REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.EXPIRATION_DAYS',
      };

      const expectedDescription = 'REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.CYCLE_DESCRIPTION';
      const description = CycleCreateFormHelper.createDescription(formValue, translateServiceMock);

      expect(translateServiceMock.translate).toHaveBeenLastCalledWith(expectedDescription, expectedInterpolationParams);
      expect(description).toBe(expectedDescription);
    });

    it('should return undefined if one of the required form values is not provided', () => {
      const formValue: CycleCreateForm = {
        duration: null,
        jobFunctionIds: ['mock_job_function'],
        jobIds: ['mock_job'],
        compliance: { value: 'mock_compliance_id', label: 'mock_compliance_name' },
        learningObject: { value: 'mock_learn_object_id', label: 'mock_learn_object_name' },
        description: 'mock_description',
        periodType: 'DAY',
      };

      const description = CycleCreateFormHelper.createDescription(formValue, translateServiceMock);

      expect(translateServiceMock.translate).not.toHaveBeenCalled();
      expect(description).toBe(undefined);
    });
  });
});
