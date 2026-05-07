import { Injectable } from '@angular/core';
import { UsersFilter } from '@app/main/users/users.types';
import { UsersServiceV2 } from '@app/shared/services/users-v2.service';
import { Observable, map } from 'rxjs';
import { KonquestUsersAPI } from '@keeps-platform-frontend-workspace/kp-keeps';

interface TransferUserEnrollment {
  source_user_id: string;
  target_user_id: string;
}

@Injectable()
export class TransferUserEnrollmentService {
  constructor(
    private _userService: UsersServiceV2,
    private http: KonquestUsersAPI,
  ) {}

  transferEnrollments(body: TransferUserEnrollment): Observable<any> {
    return this.http.transferUserEnrollments(body);
  }

  fetchUsers(userName: string) {
    const filter: UsersFilter = {
      search: userName,
      pageEvent: { pageIndex: 0, pageSize: 20, length: 0 },
      sort: { active: undefined, direction: undefined },
    };
    return this._userService.fetchWorkspaceUsers(filter).pipe(map(({ data }) => data));
  }
}
