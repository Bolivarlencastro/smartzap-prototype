import { EnrollmentStatuses } from '../../konquest-sdk';
import { ApplicationRole, UserRole } from './user.model';

export interface Workspace {
  id?: string;
  name?: string;
  description?: string;

  address?: any;
  city?: string;
  state?: string;
  country?: string;
  post_code?: string;
  company?: string;

  doc_number?: string;
  duns_number?: string;
  logo_url?: string;
  icon_url?: string;
  icon_svg_url?: string;
  theme_id?: string;
  theme_dark?: boolean;
  custom_color?: string;
  logout_url?: string;
  hash_id?: string;
  custom_login_url?: string;

  status?: boolean;
  created_date?: string;
  updated_date?: string;

  notify_teams?: boolean;
  notify_slack?: boolean;
  alura_integration_active?: boolean;

  min_performance_certificate?: number;

  allow_list_public_categories?: boolean;

  allow_list_public_channel?: boolean;
  allow_list_paid_channel?: boolean;
  allow_create_public_channel?: boolean;
  allow_create_paid_channel?: boolean;
  need_approve_channel?: boolean;

  allow_list_public_mission?: boolean;
  allow_list_paid_mission?: boolean;
  allow_create_public_mission?: boolean;
  allow_create_paid_mission?: boolean;
  need_approve_mission?: boolean;

  enrollment_goal_duration_days?: number;
  block_reenrollment?: boolean;
  custom_menu_items?: CustomMenuItem[];
  enable_email_notifications?: boolean;
  user_token_expiration?: number;
}

export type WorkspaceBasicDto = {
  id: string;
  name: string;
  logo_url: string;
  icon_url: string;
  hash_id: string;
  custom_color: string;
  theme_dark: boolean;
  logout_url: string;
  notify_teams: boolean;
  notify_slack: boolean;
  default_federated_identity_provider_alias: string;
};

export type RoleWorkspace = Pick<Workspace, 'id' | 'name' | 'icon_url' | 'logo_url'>;

export interface Service {
  id: string;
  name: string;
}

export interface WorkspaceWithUserRoles extends Workspace {
  roles?: UserRole[];
}

export interface WorkspaceWithServices extends Workspace {
  roles?: Omit<UserRole, 'workspace'>[];
  services?: Service[];
}

export interface ApplicationWithRoles {
  id: string;
  name: string;
  roles: ApplicationRole[];
}

export interface WorkspaceConfigurationInputData {
  passMark: number;
  goal_date: number;
}

export interface RawModuleService {
  id: string;
  service: {
    id: string;
    name: string;
  };
  status?: boolean;
}

export interface GamificationSubModule {
  id: string;
  ranking: string;
  status: boolean;
  can_enable: boolean;
}

export interface MissionListingConfig {
  id: string;
  filter_type: EnrollmentStatuses;
  is_enabled: boolean;
  disabled: boolean;
  label: string;
}

export type WorkspaceListDto = Pick<Workspace, 'id' | 'name'>;

export interface CustomMenuItem {
  id: string;
  icon: string;
  name: string;
  url: string;
}
