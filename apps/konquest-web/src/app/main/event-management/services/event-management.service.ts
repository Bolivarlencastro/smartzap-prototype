import { Injectable } from '@angular/core';
import { Mission, MissionEnrollmentAttendance, MissionModel } from '@app/main/mission/mission.model';
import { MissionServiceV2 } from '@app/main/mission/services/mission.service';
import { KonquestAPI } from '@core/api';
import { Observable } from 'rxjs';
import { EventManagementFilter } from '../models/filter';

@Injectable()
export class EventManagementService {
  constructor(
    private readonly missionService: MissionServiceV2,
    private readonly konquestApi: KonquestAPI,
  ) {}

  loadEvent(eventId: string): Observable<Mission> {
    return this.missionService.fetchMissionById(eventId);
  }

  loadUsers(filter: EventManagementFilter, mission_model: MissionModel): Observable<MissionEnrollmentAttendance[]> {
    const endpointPrefix = this.getEndpointByMissionModel(mission_model);

    return this.konquestApi.get<MissionEnrollmentAttendance[]>(`/mission-enrollments/${endpointPrefix}`, filter);
  }

  private getEndpointByMissionModel(mission_model: MissionModel): string {
    if (mission_model === MissionModel.PRESENTIAL) {
      return 'presential-attendances';
    }

    return 'live-attendances';
  }
}
