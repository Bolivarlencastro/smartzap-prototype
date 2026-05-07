import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { map, tap } from 'rxjs/operators';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { forkJoin, Observable } from 'rxjs';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Mission, MissionInformationDate, MissionTag } from 'app/main/mission/mission.model';
import { MissionDetailDialogContainerComponent } from '../containers/mission-detail-dialog-container/mission-detail-dialog-container.component';
import { navigateToTrail, RouteDialogService } from 'app/shared/services';
import { Router } from '@angular/router';
import { isBefore, isSameDay } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class MissionDetailService {
  private dialogRef: MatDialogRef<MissionDetailDialogContainerComponent>;

  static buildExtraMissionAttributes(mission: Mission): Mission {
    const missionModelInformation = mission[mission.mission_model?.toLowerCase() as keyof Mission];
    if (!missionModelInformation) {
      return mission;
    }

    const lastDate = missionModelInformation.dates?.[missionModelInformation.dates.length - 1]?.end_at;
    const today = new Date();
    missionModelInformation.dates.forEach(
      (date: MissionInformationDate) => (date.is_today = isSameDay(new Date(date.start_at), today)),
    );
    missionModelInformation.is_finished = isBefore(new Date(lastDate), today);
    return {
      ...mission,
      [mission.mission_model?.toLowerCase() as keyof Mission]: missionModelInformation,
    };
  }

  constructor(
    private _dialog: MatDialog,
    private _missionService: MissionServiceV2,
    private _messageService: KpMessageService,
    private routeDialogService: RouteDialogService,
    private router: Router,
  ) {}

  openDialog(): MatDialogRef<MissionDetailDialogContainerComponent> {
    this.dialogRef = this._dialog.open<MissionDetailDialogContainerComponent>(MissionDetailDialogContainerComponent, {
      autoFocus: 'dialog',
      panelClass: 'route-dialog-container',
    });
    return this.dialogRef;
  }

  closeDialog(): void {
    this.dialogRef?.close();
  }

  loadMission(missionId: string): Observable<Mission> {
    return this._missionService.fetchMissionById(missionId).pipe(
      tap({
        error: () => this._messageService.error(marker('MISSION.DETAILS.LOAD_ERROR')),
      }),
    );
  }

  onDialogDestroyed(rollBackTrailId?: string): void {
    this.routeDialogService.onDialogClosed();

    if (rollBackTrailId) {
      navigateToTrail(this.router, rollBackTrailId);
    }
  }

  updateSummary(summary: string, missionId: string) {
    return this._missionService.updateSummary(missionId, summary);
  }

  updateLiveMissionSumary(description: string, missionId: string) {
    return this._missionService.updateLiveMissionSummary(missionId, description);
  }

  createTags(missionId: string, tags: string | string[]): Observable<any[]> {
    const tagsToCreate = this.buildTagsArray(tags);
    const observables = tagsToCreate.reduce(
      (acc, tag, index) => {
        acc[`tag${index}`] = this._missionService.createTag(missionId, tag);
        return acc;
      },
      {} as { [key: string]: Observable<MissionTag> },
    );

    return forkJoin(observables).pipe(
      map((results) => Object.values(results)),
      tap({
        next: () => this._messageService.success('MISSION.DETAILS.ADD_TAG_SUCCESS'),
        error: () => this._messageService.error('MISSION.DETAILS.ADD_TAG_FAILURE'),
      }),
    );
  }

  removeTag(tagId: string): Observable<unknown> {
    return this._missionService.removeTag(tagId).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.DETAILS.REMOVE_TAG_SUCCESS')),
        error: () => this._messageService.error(marker('MISSION.DETAILS.REMOVE_TAG_FAILURE')),
      }),
    );
  }

  fetchSupportMaterials(id: string): Observable<SupportMaterial[]> {
    return this._missionService.fetchSupportMaterials(id);
  }

  private buildTagsArray(tags: string | string[]): string[] {
    if (Array.isArray(tags)) {
      return tags;
    }
    return [tags];
  }
}
