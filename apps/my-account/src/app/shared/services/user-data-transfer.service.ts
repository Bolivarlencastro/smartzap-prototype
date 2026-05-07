import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDataTransferComponent } from '@app/main/users/containers/user-data-transfer/user-data-transfer.component';
import { UsersFilter } from '@app/main/users/users.types';
import { KonquestUsersAPI, UserDataTransfer, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { UserDataTransferOption } from 'app/shared/model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class UserDataTransferService {
  constructor(
    private usersService: UsersService,
    private messageService: KpMessageService,
    private dialog: MatDialog,
    private http: KonquestUsersAPI,
  ) {}

  openUserDataTransferDialog(user: UserProfile): Observable<UserDataTransfer> {
    return this.dialog
      .open(UserDataTransferComponent, {
        width: '320px',
        data: user,
        autoFocus: 'none',
      })
      .afterClosed()
      .pipe(filter((result) => !!result));
  }

  transferData(data: UserDataTransfer) {
    return this.http.transferUser(data).pipe(
      tap({
        next: () => this.messageService.success(marker('USER_DATA_TRANSFER_DIALOG.TRANSFER_SUCCESS_MESSAGE')),
        error: () => this.messageService.error(marker('USER_DATA_TRANSFER_DIALOG.TRANSFER_FAILURE_MESSAGE')),
      }),
    );
  }

  fetchSourceUsers(search: string): Observable<UserDataTransferOption[]> {
    const filter: UsersFilter = {
      search,
      sort: { active: 'name', direction: 'asc' },
      pageEvent: { pageIndex: 0, pageSize: 10, length: 10 },
    };
    return this.usersService.fetchWorkspaceUsers(filter).pipe(
      map(({ data }) => {
        return data.map((user) => ({
          label: user.name,
          value: user.id,
          avatar: user.avatar || environment.defaultUserAvatar,
        }));
      }),
    );
  }
}
