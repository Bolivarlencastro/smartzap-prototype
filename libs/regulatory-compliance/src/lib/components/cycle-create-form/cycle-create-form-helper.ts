import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ComplianceDto,
  CycleCreateDto,
  CycleDto,
  CyclePeriodType,
  LearningObjectDto,
  KeepsUtils,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpAutocompleteOption } from '@keeps-platform-frontend-workspace/ui/kp-autocomplete';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoService } from '@jsverse/transloco';
import { CycleCreateForm, CycleCreateFormGroup, CycleLearningObjectType } from '../../models';
import { Keyof } from '@amcharts/amcharts4/.internal/core/utils/Type';

type DescriptionTranslation = {
  complianceName: string;
  learningObjectName: string;
  learningObjectType: CycleLearningObjectType;
  duration: string;
  expirationType: CyclePeriodType;
};

const CYCLE_DESCRIPTION = marker('REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.CYCLE_DESCRIPTION');

const CONNECTED_MISSION = marker('REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.CONNECTED_MISSION');
const CONNECTED_TRAIL = marker('REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.CONNECTED_TRAIL');

const EXPIRATION_YEARS = marker('REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.EXPIRATION_YEARS');
const EXPIRATION_MONTHS = marker('REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.EXPIRATION_MONTHS');
const EXPIRATION_DAYS = marker('REGULATORY_COMPLIANCE.CYCLE_FORM.DESCRIPTION.EXPIRATION_DAYS');

export class CycleCreateFormHelper {
  static buildForm(formBuilder: FormBuilder): FormGroup<CycleCreateFormGroup> {
    return formBuilder.group<CycleCreateFormGroup>({
      duration: new FormControl(null, [Validators.required, Validators.min(0)]),
      periodType: new FormControl(null, Validators.required),
      description: new FormControl('', Validators.maxLength(250)),
      compliance: new FormControl(null, KeepsUtils.objectKeyValidator<KpAutocompleteOption>('value', true)),
      learningObject: new FormControl(null, KeepsUtils.objectKeyValidator<KpAutocompleteOption>('value', true)),
      jobIds: new FormControl([]),
      jobFunctionIds: new FormControl([]),
    });
  }

  static patchForm(cycle: CycleDto, form: FormGroup<CycleCreateFormGroup>): void {
    if (!cycle) {
      return;
    }

    const formValue: CycleCreateForm = {
      ...cycle,
      learningObject: this.mapToKpAutocompleteOption(cycle?.learningObject),
      compliance: this.mapToKpAutocompleteOption(cycle?.compliance),
    };

    form.patchValue(formValue);
  }

  static parseFormToCreateDTO(formValue: CycleCreateForm): CycleCreateDto {
    const complianceId = this.getKpAutoCompleteOptionProperty(formValue.compliance);
    const learningObjectId = this.getKpAutoCompleteOptionProperty(formValue.learningObject);

    const { duration, jobIds, jobFunctionIds, description, periodType } = formValue;

    return {
      duration,
      jobIds,
      jobFunctionIds,
      learningObjectId,
      complianceId,
      description,
      periodType,
    };
  }

  static createDescription(formValue: CycleCreateForm, translateService: TranslocoService) {
    const complianceName = this.getKpAutoCompleteOptionProperty(formValue.compliance, 'label');
    const learningObjectName = this.getKpAutoCompleteOptionProperty(formValue.learningObject, 'label');
    const expiration = formValue.duration;
    const expirationType = formValue.periodType;

    if (!complianceName || !learningObjectName || !expiration || !expirationType) {
      return undefined;
    }

    return this.translateDescription(
      {
        learningObjectName,
        learningObjectType: 'mission',
        complianceName,
        expirationType,
        duration: expiration.toString(),
      },
      translateService,
    );
  }

  private static translateDescription(params: DescriptionTranslation, translateService: TranslocoService): string {
    const learningObjectType = new Map<CycleLearningObjectType, string>([
      ['mission', translateService.translate(CONNECTED_MISSION)],
      ['trail', translateService.translate(CONNECTED_TRAIL)],
    ]);

    const expirationType = new Map<CyclePeriodType, string>([
      ['DAY', translateService.translate(EXPIRATION_DAYS)],
      ['MONTH', translateService.translate(EXPIRATION_MONTHS)],
      ['YEAR', translateService.translate(EXPIRATION_YEARS)],
    ]);

    const objectTypeLabel = learningObjectType.get(params.learningObjectType);
    const expirationTypeLabel = expirationType.get(params.expirationType);

    const interpolationParams = {
      compliance: params.complianceName,
      learningObjectType: objectTypeLabel,
      learningObjectName: params.learningObjectName,
      duration: params.duration,
      periodType: expirationTypeLabel,
    };

    return translateService.translate(CYCLE_DESCRIPTION, interpolationParams);
  }

  private static getKpAutoCompleteOptionProperty(
    formControlValue: KpAutocompleteOption | string,
    prop: Keyof<KpAutocompleteOption> = 'value',
  ): string {
    if (CycleCreateFormHelper.isKpAutoCompleteOption(formControlValue)) {
      return formControlValue?.[prop];
    }

    return formControlValue;
  }

  private static mapToKpAutocompleteOption(compliance: ComplianceDto | LearningObjectDto): KpAutocompleteOption {
    if (!compliance?.id) {
      return undefined;
    }

    return { value: compliance.id, label: compliance.name };
  }

  private static isKpAutoCompleteOption(value: KpAutocompleteOption | string): value is KpAutocompleteOption {
    return typeof value === 'object';
  }
}
