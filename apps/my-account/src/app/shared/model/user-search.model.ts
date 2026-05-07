import { FormControl } from '@angular/forms';
import { ANALYTICS_ROLES, KONQUEST_ROLES, MY_ACCOUNT_ROLES, SMARTZAP_ROLES } from '@app/main/users/services/app-roles';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export interface UserSearchFilterModel<S, B> {
  roleId: S;
  status: B;
  jobPositions: S;
  activityAreas: S;
  directors: S;
  managers: S;
  leaders: S;
}

export type UserSearchFilter = UserSearchFilterModel<string[], boolean>;
export type UserSearchFilterForm = UserSearchFilterModel<FormControl<string[]>, FormControl<boolean>>;

export interface UserSearchFilterOption {
  label: string;
  value: string | boolean;
}

export interface UserSearchRoleFilterGroup {
  app: string;
  roles: UserSearchFilterOption[];
}

export const KONQUEST_ROLE_OPTIONS: UserSearchFilterOption[] = [
  { label: marker('USERS.FILTER.ROLE.KONQUEST.USER'), value: KONQUEST_ROLES['user'].id },
  { label: marker('USERS.FILTER.ROLE.KONQUEST.CURATOR'), value: KONQUEST_ROLES['curator'].id },
  { label: marker('USERS.FILTER.ROLE.KONQUEST.CONTENT'), value: KONQUEST_ROLES['content'].id },
  { label: marker('USERS.FILTER.ROLE.KONQUEST.INSTRUCTOR'), value: KONQUEST_ROLES['instructor'].id },
  { label: 'Admin', value: KONQUEST_ROLES['admin'].id },
  { label: 'Super Admin', value: KONQUEST_ROLES['super_admin'].id },
];

export const ANALYTICS_ROLE_OPTIONS: UserSearchFilterOption[] = [
  {
    label: marker('USERS.FILTER.ROLE.LEARN_ANALYTICS.BASIC_ANALYTICS_USER'),
    value: ANALYTICS_ROLES['basic_analytics_user'].id,
  },
  {
    label: marker('USERS.FILTER.ROLE.LEARN_ANALYTICS.BASIC_ANALYTICS_LEADER'),
    value: ANALYTICS_ROLES['basic_analytics_leader'].id,
  },
  {
    label: marker('USERS.FILTER.ROLE.LEARN_ANALYTICS.BASIC_ANALYTICS_ADMIN'),
    value: ANALYTICS_ROLES['basic_analytics_admin'].id,
  },
];

export const MY_ACCOUNT_ROLE_OPTIONS: UserSearchFilterOption[] = [
  { label: marker('USERS.FILTER.ROLE.MY_ACCOUNT.ACCOUNT_ADMIN'), value: MY_ACCOUNT_ROLES['account_admin'].id },
  { label: marker('USERS.FILTER.ROLE.MY_ACCOUNT.COMPANY_ADMIN'), value: MY_ACCOUNT_ROLES['company_admin'].id },
  { label: 'Keeps Admin', value: MY_ACCOUNT_ROLES['keeps_admin'].id },
];

export const SMARTZAP_ROLE_OPTIONS: UserSearchFilterOption[] = [
  { label: marker('USERS.FILTER.ROLE.SMARTZAP.USER'), value: SMARTZAP_ROLES['user'].id },
  { label: 'Admin', value: SMARTZAP_ROLES['admin'].id },
];

export const ROLE_OPTIONS: UserSearchRoleFilterGroup[] = [
  {
    app: 'Konquest',
    roles: KONQUEST_ROLE_OPTIONS,
  },
  {
    app: 'Learn Analytics',
    roles: ANALYTICS_ROLE_OPTIONS,
  },
  {
    app: 'My Account',
    roles: MY_ACCOUNT_ROLE_OPTIONS,
  },
  {
    app: 'Smartzap',
    roles: SMARTZAP_ROLE_OPTIONS,
  },
];

export const STATUS_OPTIONS: UserSearchFilterOption[] = [
  {
    label: 'USERS.FILTER.STATUS.ENABLED',
    value: true,
  },
  {
    label: 'USERS.FILTER.STATUS.DISABLED',
    value: false,
  },
];
