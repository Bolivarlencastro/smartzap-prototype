import { CyclePeriodType } from './cycle-period-type';

export interface CycleCreateDto {
  duration: number;
  description: string;
  complianceId: string;
  learningObjectId: string;
  jobIds: Array<string>;
  jobFunctionIds: Array<string>;
  periodType: CyclePeriodType;
}
