export * from './user-search.model';

export interface KonquestConfig {
  allow_create_paid_channel: boolean;
  allow_create_paid_mission: boolean;
  allow_create_public_channel: boolean;
  allow_create_public_mission: boolean;
  allow_list_paid_channel: boolean;
  allow_list_paid_mission: boolean;
  allow_list_public_channel: boolean;
  allow_list_public_mission: boolean;
  icon_url: string;
  id: string;
  logo_url: string;
  name: string;
  need_approve_channel: boolean;
  need_approve_mission: boolean;
  status: boolean;
}

export interface UserOption {
  label: string;
  value: string;
}

export interface UserDataTransferOption extends UserOption {
  avatar: string;
}

export const ETHNICITIES: UserOption[] = [
  { label: 'USERS.DETAIL.TABS.PERSONAL.ETHNICITY.WHITE', value: 'WHITE' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.ETHNICITY.BLACK', value: 'BLACK' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.ETHNICITY.BROWN', value: 'BROWN' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.ETHNICITY.ASIAN', value: 'ASIAN' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.ETHNICITY.INDIGENOUS', value: 'INDIGENOUS' },
];

export const GENRES: UserOption[] = [
  { label: 'USERS.DETAIL.TABS.PERSONAL.GENDER.MALE', value: 'MALE' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.GENDER.FEMALE', value: 'FEMALE' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.GENDER.OTHER', value: 'OTHER' },
];

export const MARITAL_STATUSES: UserOption[] = [
  { label: 'USERS.DETAIL.TABS.PERSONAL.MARITAL_STATUS.SINGLE', value: 'SINGLE' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.MARITAL_STATUS.MARRIED', value: 'MARRIED' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.MARITAL_STATUS.DIVORCED', value: 'DIVORCED' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.MARITAL_STATUS.WIDOWED', value: 'WIDOWED' },
  { label: 'USERS.DETAIL.TABS.PERSONAL.MARITAL_STATUS.SEPARATED', value: 'SEPARATED' },
];
