import { RoleUser } from './role.model';

export * from './learn-content.model';
export * from './analytics.model';
export * from './base-entity.model';
export * from './user.model';
export * from './application.model';
export * from './role.model';

export class User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  // tslint:disable-next-line:variable-name
  secondary_email: string;
  phone: string;
  gender: string;
  job: string;
  birthday: any;
  address: string;
  avatar: string;
  status: boolean;
  // tslint:disable-next-line:variable-name
  created_date: Date;
  // tslint:disable-next-line:variable-name
  updated_date: Date;
  language: Language;
  roles: Array<RoleUser>;

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
    this.roles = userData.roles;
  }
}

export class Language {
  id: string;
  name: string;
  status: boolean;
  // tslint:disable-next-line:variable-name
  created_date: Date;
  // tslint:disable-next-line:variable-name
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

export interface PaginationParams {
  finished: boolean;
  nextPage: string;
}

export interface ImageResponse {
  large: string;
  small: string;
  vertical: string;
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
  language: new Language(),
  roles: [],
};
