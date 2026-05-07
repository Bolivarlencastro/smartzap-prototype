import { Injectable } from '@angular/core';
import {
  LanguagesApi,
  UserProfile,
  UserProfileService,
  UserUpdateDTO,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfilePageData } from '../types';
import { navItems } from './nav-items.data';

@Injectable()
export class ProfileService {
  private navItems = new BehaviorSubject(navItems);
  private pageData = new Subject<ProfilePageData>();
  readonly navItems$ = this.navItems.asObservable();
  readonly pageData$ = this.pageData.asObservable();
  readonly userProfile$: Observable<UserProfile> = this._userProfileService.profile$;
  readonly user$: Observable<UserProfile> = this._userProfileService.user$;

  constructor(
    private _userProfileService: UserProfileService,
    private languagesApi: LanguagesApi,
  ) {}

  get title$() {
    return this.pageData$.pipe(map(({ title }) => title));
  }

  get subtitle$() {
    return this.pageData$.pipe(map(({ subtitle }) => subtitle));
  }

  updateProfile(user: UserUpdateDTO): void {
    this._userProfileService.updateProfile(user);
  }

  fetchUser(): void {
    this._userProfileService.fetchUserData();
  }

  uploadAvatar(image: File): void {
    this._userProfileService.uploadAvatar(image);
  }

  fetchLanguages() {
    return this.languagesApi.fetchLanguages();
  }

  updatePageData(data: ProfilePageData) {
    this.pageData.next({ ...data });
  }
}
