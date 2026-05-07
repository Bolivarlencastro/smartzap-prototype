import { User } from '@core/model';
import { Enrollment } from '@core/model/enrollment.model';
import { ScormSteps } from 'app/main/mission/models';

import { DevelopmentStatus, EnrollmentStatuses, LanguageTypes } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { FilterOption, QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';

export class LearnKontentType {
  constructor(
    public id?: string,
    public name?: string,
  ) {}
}

export class MissionProvider {
  constructor(
    public id: string,
    public name: string,
    public icon: string,
    public description?: string,
    public checked?: boolean,
  ) {}
}

export class MissionCategory {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public image?: string,
    public checked?: boolean,
  ) {}
}

export class MissionType {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public image?: string,
  ) {}
}

export class ContentResume {
  constructor(
    public count?: number,
    public image?: string,
    public image_cover?: string,
    public name?: string,
  ) {}
}

export class MissionTag {
  constructor(
    public name?: string,
    public relevance?: number,
    public id?: string,
  ) {}
}

export enum MissionModel {
  INTERNAL = 'INTERNAL',
  EXTERNAL_PROVIDER = 'EXTERNAL_PROVIDER',
  SCORM = 'SCORM',
  LIVE = 'LIVE',
  PRESENTIAL = 'PRESENTIAL',
}

export class Mission {
  constructor(
    public id?: string,
    public content_resume?: ContentResume[],
    public created_date?: string,
    public description?: string,
    public users_enrolled?: number,
    public enrollments_accepted?: number,
    public development_status?: DevelopmentStatus,
    public duration_time?: number,
    public enrolled?: boolean,
    public enrollment?: Enrollment,
    public expiration_date?: string | Date,
    public external_course_url?: string,
    public holder_image?: string | null,
    public users_finished?: string,
    public is_active?: boolean,
    public is_owner?: boolean,
    public is_contributor?: boolean,
    public managed?: boolean,
    public match?: number,
    public learning_trail_linked?: boolean,
    public language?: LanguageTypes,
    public mission_category?: MissionCategory | string,
    public mission_model?: MissionModel,
    public mission_type?: MissionType | string,
    public name?: string,
    public points?: number,
    public external?: ExternalMission,
    public provider?: MissionProvider | string,
    public provider_mission_type?: string,
    public rating?: number,
    public presential?: MissionPresential,
    public live?: MissionLive,
    public summary?: string,
    public subtitle?: string,
    public rating_avg?: number,
    public rating_count?: number,
    public ratings_total?: number,
    public routerLink?: string,
    public routerName?: string,
    public stages?: MissionStage[],
    public steps?: ScormSteps[],
    public tags?: MissionTag[],
    public thumb_image?: string | null,
    public user_creator?: UserCreator | string,
    public user_progress?: number,
    public is_temporary?: boolean,
    public vertical_holder_image?: string | null,
    public required_evaluation?: boolean,
    public assessment_type?: string,
    public imageDefinition?: any,
    public allow_self_enrollment_renewal?: boolean,
    public allow_self_reproved_enrollment_renewal?: boolean,
    public minimum_performance?: number,
    public workspace_min_performance?: number,
    public workspace_source_id?: string,
    public bookmark_id?: string,
    public stats?: any,
    public enrollment_goal_duration_days?: string,
    public course_model?: string,
    public missionTags?: LearnContentCardTag[],
    public is_integration?: boolean,
    public min_time_in_content?: number,
  ) {}
}

export interface ExternalMission {
  course_url: string;
  provider: string | MissionProvider;
}

export interface MissionIcon {
  name: string;
  color: string;
}

export interface MissionPresential extends MissionModelInformation {
  address: string;
}

export interface MissionLive extends MissionModelInformation {
  url: string;
}

export interface MissionModelInformation {
  allow_any_enrollment: boolean;
  dates: MissionInformationDate[];
  id: number;
  instructors: MissionInstructor[] | string[];
  notify_users_enrolled: boolean;
  seats: number;
  remaining_seats: number;
  is_finished?: boolean;
  users_enrolled: number;
  auto_attendance?: boolean;
}

export interface MissionInstructor {
  id: string;
  name: string;
  avatar?: string;
}

export interface NewInstructorData {
  name: string;
  email: string;
  avatar: File;
  avatarData: string;
}

export interface MissionInformationDate {
  id?: string;
  start_at: string;
  end_at: string;
  allow_self_attendance?: boolean;
  is_today?: boolean;
  touched?: boolean;
  deleted?: boolean;
  date?: string | Date;
  count_users_attending?: number;
}

export class MissionStage {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public order?: number,
    public contents?: MissionStageContent[],
    public mission?: Mission | string,
    public questions?: any[],
    public user_completed?: boolean,
    public stage?: string,
    public prev?: number,
    public next?: number,
  ) {}
}

export class MissionStep {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public contentType?: string,
    public learn_content_id?: string,
    public completed?: boolean,
    public order?: number,
    public current?: boolean,
    public mission?: string,
    public next?: number,
    public prev?: number,
    public skippedByUser?: boolean,
    public progress?: number,
  ) {}
}

export class MissionStageContent {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public learn_content_id?: string,
    public learn_content_uuid?: string,
    public learn_content_type?: LearnKontentType,
    public order?: number,
    public stage?: string,
    public content?: string[],
    public user_completed?: boolean,
  ) {}
}

export class MissionEnrollment {
  id: string;
  learning_trail_linked: boolean;
  name: string;
  user_creator: string;

  constructor(enrollment: MissionEnrollment) {
    this.id = enrollment.id;
    this.learning_trail_linked = enrollment.learning_trail_linked;
    this.name = enrollment.name;
    this.user_creator = enrollment.user_creator;
  }
}

export class UserCreator {
  constructor(
    public id?: string,
    public name?: string,
    public avatar?: string,
    public icon_url?: string,
  ) {}
}

export interface MissionSubject {
  uuid: string;
  name: string;
  attachments: MissionAttachment[];
  questions: any[];
}

export interface MissionAttachment {
  uuid: string;
  name: string;
  icon: string;
}

export interface MissionContentFile {
  id: string;
  percentage: number;
  loading: boolean;
}

export interface MissionFilter {
  MINE: FilterOption;
  MY_LIST: FilterOption;
  HOME: FilterOption;
}

export interface MissionEnrollmentAttendance {
  id: string;
  enrollment: {
    id?: string;
    user: User;
    status: EnrollmentStatuses;
  };
  created_date: string;
  updated_date: string;
  presented: boolean | null;
  date: string;
  observation?: string;
}

export type MissionScreenType = 'missions' | 'events';

export const missionFilterKeys = new Map<string, string>([
  ['KEY_MISSION_FILTER_CATEGORY', 'MISSION_FILTER_CATEGORY'],
  ['KEY_MISSION_FILTER_LANGUAGUE', 'MISSION_FILTER_LANGUAGE'],
  ['KEY_MISSION_FILTER_MISSION_MODEL', 'MISSION_FILTER_MISSION_MODEL'],
  ['KEY_MISSION_FILTER_RANGE', 'MISSION_FILTER_RANGE'],
  ['KEY_MISSION_FILTER_PROVIDER', 'MISSION_FILTER_PROVIDER'],
]);

export const eventFilterKeys = new Map<string, string>([
  ['KEY_EVENT_FILTER_CATEGORY', 'EVENT_FILTER_CATEGORY'],
  ['KEY_EVENT_FILTER_LANGUAGUE', 'EVENT_FILTER_LANGUAGE'],
  ['KEY_EVENT_FILTER_MISSION_MODEL', 'EVENT_FILTER_MISSION_MODEL'],
  ['KEY_EVENT_FILTER_RANGE', 'EVENT_FILTER_RANGE'],
]);

export interface MissionsFilter {
  page: number;
  per_page: number;
  type: QuickFilterType;
  search?: string;
  categories?: string[];
  languages?: string[];
  providers?: string[];
  missionModels?: string[];
  minimum_performance__gte?: string;
  minimum_performance__lte?: string;
}

export interface ImportMenuItem {
  name: string;
  icon: string;
  disabled?: boolean;
}

export interface ImportCheckModel {
  enrolled: UsersImported[];
  not_registered: UsersImported[];
  registered: UsersImported[];
}

export interface UsersImported {
  name: string;
  email: string;
  status?: string;
}

export interface ImportConfirmation {
  date_id: string;
  persons: UsersImported[];
}

export enum ImportStatus {
  ENROLLED = 'ENROLLED',
  REGISTERED = 'REGISTERED',
  NOT_REGISTERED = 'NOT_REGISTERED',
}

export type AttendaceListViewMode = 'import-error' | 'import-success' | 'import-confirmation' | 'list';

export interface SupportMaterialCreateDto {
  mission_id: string;
  kontent_content_id: string;
  title: string;
  description: string;
  order: number;
}
