import { CycleDto } from './cycle-dto';
import { LearningObjectDto } from './learning-object-dto';
import { UserDto } from './user-dto';

export interface EnrollmentDto {
  id: string;
  learningObject: LearningObjectDto;
  user: UserDto;
}

export type EnrollmentCycleStatus = 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'DISABLED' | 'EXPIRING';

export interface EnrollmentCycleDto {
  id: string;
  status: EnrollmentCycleStatus;
  cycle: Pick<CycleDto, 'compliance' | 'duration' | 'id'>;
  enrollment: EnrollmentDto;
  deadline: string;
  createdDate: string;
  cyclesCount: number;
}

export type EnrollmentCycleRenewResult = Pick<
  EnrollmentCycleDto,
  'id' | 'status' | 'deadline' | 'createdDate' | 'cyclesCount'
>;
