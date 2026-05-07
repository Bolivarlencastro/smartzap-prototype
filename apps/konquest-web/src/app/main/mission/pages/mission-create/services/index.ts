import { ContentCreateService } from './content-create.service';
import { ContentUploadService } from './content-upload.service';
import { MissionCreateService } from './mission-create.service';
import { MissionGroupsService } from './mission-groups.service';
import { MissionInstructorsService } from './mission-instructors.service';

export const FEATURE_SERVICES = [
  MissionCreateService,
  ContentCreateService,
  ContentUploadService,
  MissionGroupsService,
  MissionInstructorsService,
];
