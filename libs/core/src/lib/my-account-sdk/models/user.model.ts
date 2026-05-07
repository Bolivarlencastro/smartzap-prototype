import { Language } from './language.model';

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  email: string;
  secondary_email: string;
  phone: string;
  avatar: string;
  gender: string;
  birthday: string;
  address: string;
  country: string;
  status: boolean;
  time_zone: string;
  cpf: string;
  ein: string;
  education: string;
  ethnicity: string;
  marital_status: string;
  hierarchical_level: string;
  contract_type: string;
  admission_date: string;
  language: Language;
  roles?: UserRoleV2[];
  employee_info?: UserEmployeeInfos;
  related_user_leader?: UserProfile;
  use_idp_login?: boolean;
  use_two_factor_auth?: boolean;
  two_factor_auth_pending?: boolean;
}

export type BasicUserProfile = Pick<UserProfile, 'id' | 'name' | 'avatar' | 'email'>;

export interface UserEmployeeInfos {
  area_of_activity: string;
  created_date: string;
  director: string;
  id: string;
  job_function: { id: string; name: string };
  job_position: { id: string; name: string };
  manager: string;
  updated_date: string;
}

export type UserCreateDTO = {
  name?: string;
  email?: string;
  ein?: string;
  nickname?: string;
  secondary_email?: string;
  related_user_leader_email?: string;
  related_user_leader_id?: string;
  birthday?: string;
  language_id?: string;
  phone?: string;
  gender?: string;
  address?: string;
  avatar?: string;
  country?: string;
  time_zone?: string;
  admission_date?: string;
  contract_type?: string;
  cpf?: string;
  education?: string;
  ethnicity?: string;
  hierarchical_level?: string;
  marital_status?: string;
  employee_info?: {
    job_function_id?: string;
    job_position_id?: string;
    director?: string;
    manager?: string;
    area_of_activity?: string;
  };
  use_idp_login?: boolean;
  use_two_factor_auth?: boolean;
};

export type UserUpdateDTO = Omit<UserCreateDTO, 'email'>;

export interface UserRole {
  id: string;
  role: {
    id: string;
    name: string;
    key: string;
    application: UserApplication;
  };
  workspace: UserWorkspace;
  user?: { id: string; name: string; phone: string; email: string; avatar: string };
}

export interface UserRoleV2 {
  id: string;
  key: string;
  role_id: string;
  role_name: string;
  workspace_id: string;
  application_id: string;
  application_name: string;
}

export interface UserApplication {
  id: string;
  name: string;
}

export type ApplicationRole = {
  id: string;
  key: string;
};

export interface UserWorkspace {
  id: string;
  name: string;
}

export interface MyAccountV2Pagination<T> {
  data: T[];
  links: MyAccountV2PaginationLinks;
  meta: MyAccountV2PaginationMeta;
}

interface MyAccountV2PaginationLinks {
  current: string;
  last: string;
  next: string;
  previous: string;
  first: string;
}

interface MyAccountV2PaginationMeta {
  current_page: number;
  items_per_page: number;
  sort_by: unknown[];
  total_items: number;
  total_pages: number;
}

export interface MyAccountV2UsersApiParams {
  page: number;
  limit: number;
  'filter.name': string | string[];
  'filter.email': string | string[];
  'filter.status': string | string[];
  'filter.employeeInfos.manager': string | string[];
  'filter.employeeInfos.director': string | string[];
  'filter.employeeInfos.areaOfActivity': string | string[];
  'filter.language.name': string | string[];
  'filter.relatedUserLeaderId': string | string[];
  'filter.employeeInfos.jobPositionId': string | string[];
  'filter.employeeInfos.jobFunctionId': string | string[];
  'filter.roles.role.id': string | string[];
  'filter.roles.role.application.id': string | string[];
  sortBy: string | string[];
  search: string;
  searchBy: string | string[];
  select: string;
}
