import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KonquestAPI } from '@core/api';
import {
  Mission,
  MissionInstructor,
  MissionLive,
  MissionPresential,
  NewInstructorData,
} from 'app/main/mission/mission.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { NewInstructorDialogComponent } from '../components/new-instructor-dialog/new-instructor-dialog.component';
import { Paginated } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class MissionInstructorsService {
  static getInstructorsFromMission(mission: Mission): MissionInstructor[] {
    const modelInfo: MissionLive | MissionPresential = mission[mission.mission_model.toLowerCase()];
    return (modelInfo?.instructors as MissionInstructor[]) || [];
  }

  constructor(
    private _dialog: MatDialog,
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  registerInstructor(newInstructorFormData: NewInstructorData): Observable<MissionInstructor> {
    const formData = new FormData();
    formData.append('name', newInstructorFormData.name);
    formData.append('email', newInstructorFormData.email);
    if (newInstructorFormData.avatar) {
      formData.append('avatar', newInstructorFormData.avatar);
    }
    return this._http.postFormData<MissionInstructor>('/accounts/users/instructors', formData).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.REGISTER_INSTRUCTOR')),
        error: (error) => this._messageService.error(error?.error?.detail),
      }),
    );
  }

  addInstructor(instructorId: string, missionId: string): Observable<any> {
    return this._http.post(`/missions/sync/${missionId}/instructor`, { user_id: instructorId }).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.ADD_INSTRUCTOR')),
        error: () => this._messageService.error('MISSION.CREATE.ERROR.ADD_INSTRUCTOR'),
      }),
    );
  }

  removeInstructor(instructorId: string, missionId: string): Observable<any> {
    return this._http.delete(`/missions/sync/${missionId}/instructor/${instructorId}`).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.REMOVE_INSTRUCTOR')),
        error: (error) => this._messageService.error(error?.error?.detail),
      }),
    );
  }

  filterInstructors(searchTerm: string): Observable<Paginated<MissionInstructor>> {
    return this._http.get<Paginated<MissionInstructor>>('/accounts/users/instructors', { search: searchTerm });
  }

  openNewInstructorDialog(): Observable<NewInstructorData> {
    return this._dialog
      .open<NewInstructorDialogComponent, any, NewInstructorData>(NewInstructorDialogComponent, {
        minWidth: '35vw',
        autoFocus: 'dialog',
      })
      .afterClosed()
      .pipe(filter((instructorData) => !!instructorData));
  }
}
