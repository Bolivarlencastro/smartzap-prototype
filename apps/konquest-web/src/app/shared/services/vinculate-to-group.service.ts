import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupAPI } from '@app/main/group/groups/group.api';
import { VinculateGroupApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, map, tap } from 'rxjs';
import { VinculateGroupType } from '../components/vinculate-to-group/models';
import { VinculateToGroupComponent } from '../components/vinculate-to-group/vinculate-to-group.component';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Group } from '@app/main/group/groups/group.model';

@Injectable({ providedIn: 'root' })
export class VinculateToGroupService {
  constructor(
    private _dialog: MatDialog,
    private _groupAPI: GroupAPI,
    private _vinculateGroupAPI: VinculateGroupApi,
    private _messageService: KpMessageService,
  ) {}

  openDialog(): Observable<string> {
    return this._dialog
      .open(VinculateToGroupComponent, {
        autoFocus: 'dialog',
        width: '350px',
        disableClose: true,
      })
      .afterClosed();
  }

  fetchGroups(search: string): Observable<Group[]> {
    return this._groupAPI.fetchByQuery({ search }).pipe(map((response) => response?.results));
  }

  vinculateGroup(groupId: string, type: VinculateGroupType, contentId: string): Observable<unknown> {
    const map = new Map<VinculateGroupType, Observable<unknown>>([
      ['course', this.vinculateCourseToGroup(groupId, contentId)],
      ['learning-trail', this.vinculateLearningTrailToGroup(groupId, contentId)],
      ['channel', this.vinculateChannelToGroup(groupId, contentId)],
    ]);
    return map.get(type);
  }

  private vinculateCourseToGroup(groupId: string, contentId: string): Observable<unknown> {
    return this._vinculateGroupAPI.vinculateCourse(groupId, contentId).pipe(
      tap((res) => {
        if (res?.['group_mission_errors']?.length) {
          return;
        }

        this._messageService.success('GROUP.SUCCESS.LINKED_SUCCESS');
      }),
    );
  }

  private vinculateLearningTrailToGroup(groupId: string, contentId: string): Observable<unknown> {
    return this._vinculateGroupAPI.vinculateLearningTrail(groupId, contentId).pipe(
      tap((res) => {
        if (res?.['group_learning_trail_errors']?.length) {
          return;
        }

        this._messageService.success('GROUP.SUCCESS.LINKED_SUCCESS');
      }),
    );
  }

  private vinculateChannelToGroup(groupId: string, contentId: string): Observable<unknown> {
    return this._vinculateGroupAPI.vinculateChannel(groupId, contentId).pipe(
      tap((res) => {
        if (res?.['errors']?.length) {
          return;
        }

        this._messageService.success('GROUP.SUCCESS.LINKED_SUCCESS');
      }),
    );
  }
}
