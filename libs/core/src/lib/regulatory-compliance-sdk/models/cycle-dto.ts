import { ComplianceDto } from './compliance-dto';
import { CyclePeriodType } from './cycle-period-type';
import { LearningObjectDto } from './learning-object-dto';

export interface CycleDto {
  id: string;
  duration: number;
  periodType: CyclePeriodType;
  description: string;
  compliance: ComplianceDto;
  learningObject: LearningObjectDto;
  jobIds: Array<string>;
  jobFunctionIds: Array<string>;
  enrollmentsCount: number;
  createdDate: string;
  updatedDate: string;
}
