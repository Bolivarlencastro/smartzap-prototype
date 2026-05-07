import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PasswordDialogComponent } from '@app/main/users/components/password-dialog/password-dialog.component';
import { UsersFilter } from '@app/main/users/users.types';
import {
  EmployeeInfosApi,
  EmployeeInfosType,
  MyAccountV2Pagination,
  SetUserApplicationRolesDto,
  UserCreateDTO,
  UserProfile,
  UsersApi,
  UserUpdateDTO,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KeepsError } from '@core/model';
import { format } from 'date-fns';
import { environment } from 'environments/environment';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = '/users';
  private nextSaveAvatar: File | undefined;

  constructor(
    private http: MyAccountV2API,
    private _messageService: KpMessageService,
    private _dialog: MatDialog,
    private _employeeInfosApi: EmployeeInfosApi,
    private _usersApi: UsersApi,
  ) {}

  fetchUser(id: string): Observable<any> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${id}`);
  }

  fetchAllEmployeeInfos(): Observable<{
    activityAreas: string[];
    directors: string[];
    managers: string[];
  }> {
    return forkJoin({
      activityAreas: this.fetchEmployeeInfosByType('areas-of-activity'),
      directors: this.fetchEmployeeInfosByType('directors'),
      managers: this.fetchEmployeeInfosByType('managers'),
    });
  }

  generateTemporaryPassword(userId: string) {
    const password = (Math.floor(Math.random() * 90000000) + 10000000).toString();

    return this.http
      .post<any>(`/users/set-password`, {
        user_id: userId,
        password,
        temporary: true,
      })
      .pipe(
        tap({ error: () => this._messageService.error('USER.ERROR') }),
        map(() => password),
      );
  }

  openTemporaryPasswordPreview(password: string) {
    this._dialog.open(PasswordDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      width: '100%',
      maxWidth: '420px',
      data: { password },
    });
  }

  openRemoveFromWorkspaceConfirmationDialog() {
    const deleteDialogRef = this._dialog.open(KpConfirmDialogComponent, {
      width: '600px',
    });

    deleteDialogRef.componentInstance.confirmTitle = marker('WORKSPACE_DIALOG.CONFIRM_REMOVE_WORKSPACE_TITLE');
    deleteDialogRef.componentInstance.confirmMessage = marker('WORKSPACE_DIALOG.CONFIRM_REMOVE_WORKSPACE');
    deleteDialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    return deleteDialogRef.afterClosed();
  }

  fetchWorkspaceUsers(filter: UsersFilter): Observable<MyAccountV2Pagination<UserProfile>> {
    const { sort, pageEvent, search } = filter;
    const ordering = this.getPageOrdering(sort);
    const params = { search, page: pageEvent.pageIndex + 1, per_page: pageEvent.pageSize, ordering };
    return this.http.get<MyAccountV2Pagination<UserProfile>>(`/users`, params).pipe(
      catchError((err) => {
        this._messageService.error("Couldn't load users");
        return throwError(() => new Error(err));
      }),
    );
  }

  saveUser(user: UserCreateDTO, userId: string, userRoles?: SetUserApplicationRolesDto[]) {
    const shouldUploadAvatarBeforeSaving = !!this.nextSaveAvatar;

    if (shouldUploadAvatarBeforeSaving) {
      return this.saveUserAvatar().pipe(
        switchMap(({ url }) => {
          const userWithAvatar = { ...user, avatar: url };
          return this.saveUserProfile(userWithAvatar, userId, userRoles);
        }),
      );
    }

    return this.saveUserProfile(user, userId, userRoles);
  }

  setUserAvatarForUpload(image: File) {
    this.nextSaveAvatar = image;
  }

  removeUserFromCurrentWorkspace(userId: string): Observable<any> {
    return this.http.delete(`/user-roles/${userId}`).pipe(
      tap({
        next: () => this._messageService.success(marker('USER.DELETE_USER_SUCCESS')),
        error: () => this._messageService.error(marker('USER.DELETE_USER_ERROR')),
      }),
    );
  }

  sendInvitationEmail(userId: string): Observable<void> {
    return this.http
      .post<void>(`/invitations/resend-invitation`, {
        user_id: userId,
      })
      .pipe(
        tap({
          next: () => this._messageService.success(marker('USERS.EMAIL_SEND_SUCCESS')),
          error: () => this._messageService.error(marker('USER_SEND_INVITATION_ERROR')),
        }),
      );
  }

  listUsersForLeaderAutocomplete(search: string, userId: string): Observable<UserProfile[]> {
    const params: Record<string, any> = {
      search,
      'filter.status': `$eq:true`,
      sortBy: `name:DESC`,
      select: 'id,name',
      'filter.id': `$not:$in:${userId}`,
    };

    return this.http.get<MyAccountV2Pagination<UserProfile>>('/users', params).pipe(map((result) => result.data));
  }

  private getPageOrdering(sort: Sort) {
    if (!sort?.direction) {
      return '';
    }

    if (sort.direction === 'desc') {
      return '-' + sort.active;
    }

    return sort.active;
  }

  private saveUserProfile(user: UserCreateDTO, userId: string, userRoles?: SetUserApplicationRolesDto[]) {
    if (userId) {
      return this.updateUser(userId, user, userRoles);
    }

    return this.createUser(user);
  }

  private saveUserAvatar() {
    const formData = new FormData();

    const userAvatar = this.getUserImage();
    formData.append('file', userAvatar);

    return this.http.postFormData<{ url: string }>(`/user-avatar`, formData);
  }

  private getUserImage(): File | undefined {
    const currentAvatar = this.nextSaveAvatar;

    if (!currentAvatar) {
      return undefined;
    }

    const temp: File = new File([currentAvatar], currentAvatar.name, { type: currentAvatar.type });
    this.nextSaveAvatar = undefined;

    return temp;
  }

  private createUser(userFormDTO: UserCreateDTO): Observable<UserProfile> {
    const body = {
      ...this.normalizeUser(userFormDTO),
      permissions: [environment.roleAccountAdmin],
    };

    return this.http
      .post<UserProfile>(this.baseUrl, body)
      .pipe(map((user) => user))
      .pipe(
        tap({
          next: () => this._messageService.success(marker('USER.CREATE_USER_SUCCESS')),
          error: (error) => this._messageService.error(this.resolveUserSaveErrorMessage(error, false)),
        }),
      );
  }

  private updateUser(userId: string, user: UserCreateDTO, userRoles: SetUserApplicationRolesDto[]) {
    return this.updateRolesAndUser(userId, user, userRoles).pipe(
      tap({
        next: () => this._messageService.success(marker('USER.UPDATE_USER_SUCCESS')),
        error: (error) => this._messageService.error(this.resolveUserSaveErrorMessage(error, true)),
      }),
    );
  }

  private updateRolesAndUser(userId: string, user: UserCreateDTO, userRoles: SetUserApplicationRolesDto[]) {
    if (!userRoles?.length) {
      return this.updateUserProfile(userId, user);
    }

    return forkJoin({
      user: this.updateUserProfile(userId, user),
      userRoles: this.updateUserRoles(userId, userRoles),
    }).pipe(map(({ user }) => user));
  }

  private updateUserRoles(userId: string, roles: SetUserApplicationRolesDto[]) {
    return this._usersApi.setUserApplicationRoles(userId, roles);
  }

  private updateUserProfile(userId: string, user: UserCreateDTO): Observable<UserProfile> {
    const { email, ...properties } = user;
    const updateDto: UserUpdateDTO = properties;

    return this.http
      .patch<UserProfile>(`${this.baseUrl}/${userId}`, this.normalizeUser(updateDto))
      .pipe(map((user) => ({ ...user, id: userId })));
  }

  private resolveUserSaveErrorMessage(error: unknown, isUpdate: boolean): string {
    if (error instanceof KeepsError && error.error.errorCode === 'DUPLICATE_CPF') {
      return marker('USER.DUPLICATE_CPF_ERROR');
    }
    return isUpdate ? marker('USER.UPDATE_USER_ERROR') : marker('USER.CREATE_USER_ERROR');
  }

  private normalizeUser(user: UserCreateDTO) {
    const { birthday: birthdayToParse, ...properties } = user;
    const birthday = birthdayToParse ? format(new Date(birthdayToParse), 'yyyy-MM-dd') : null;
    return { ...properties, birthday };
  }

  private fetchEmployeeInfosByType(type: EmployeeInfosType): Observable<string[]> {
    const params = { perPage: 999 };
    return this._employeeInfosApi.fetchEmployeeInfosByType(type, params).pipe(map((res) => res.items));
  }
}
