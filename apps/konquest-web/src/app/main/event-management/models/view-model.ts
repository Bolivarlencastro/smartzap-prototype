import { Mission, MissionEnrollmentAttendance, MissionInformationDate } from '@app/main/mission/mission.model';
import { EventManagementFilter } from './filter';

export interface EventManagementViewModel {
  eventLoading: boolean;
  usersLoading: boolean;
  event: Mission;
  filter: EventManagementFilter;
  dateFilterOptions: MissionInformationDate[];
  users: MissionEnrollmentAttendance[];
}
