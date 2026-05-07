import { LanguageTypes } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface UserCreator {
  avatar: string;
  country: string;
  ein: string;
  email: string;
  email_verified: boolean;
  id: string;
  job: string;
  language: LanguageTypes;
  last_access_date: string;
  name: string;
  phone: string;
  related_user_leader: string;
  status: boolean;
}

export class User {
  id: string;
  name: string;
  email: string;
  phone: string;
  job: string;
  avatar: string;
  status: boolean;
  language?: UserLanguage | string;
  roles?: Array<any>;
  created_date?: Date;
  updated_date?: Date;
  birthday?: any;
  address?: string;
  nickname?: string;
  gender?: string;
  secondary_email?: string;

  constructor(user = {}) {
    const userData = { ...userDefaultValues, ...user };

    this.id = userData.id;
    this.name = userData.name;
    this.nickname = userData.nickname;
    this.email = userData.email;
    this.secondary_email = userData.secondary_email;
    this.phone = userData.phone;
    this.gender = userData.gender;
    this.job = userData.job;
    this.birthday = userData.birthday;
    this.address = userData.address;
    this.avatar = userData.avatar;
    this.status = userData.status;
    this.created_date = userData.created_date;
    this.updated_date = userData.updated_date;
    this.language = userData.language;
    this.roles = [];
  }
}

export class UserLanguage {
  id: string;
  name: string;
  status: boolean;
  created_date: Date;
  updated_date: Date;

  constructor(language?) {
    language = language || {};
    this.id = language.id || '';
    this.name = language.name || '';
    this.created_date = language.created_date || new Date();
    this.updated_date = language.updated_date || new Date();
    this.status = language.status || true;
  }
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

const userDefaultValues = {
  id: '',
  name: '',
  nickname: '',
  email: '',
  secondary_email: '',
  phone: '',
  gender: Gender.MALE,
  job: '',
  birthday: '',
  address: '',
  avatar: '',
  status: true,
  created_date: new Date(),
  updated_date: new Date(),
  language: new UserLanguage(),
  roles: [],
};
