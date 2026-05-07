import { Injectable } from '@angular/core';
import { apps, UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { combineLatest, Observable, switchMap } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { MissionScormService } from 'app/main/mission/pages/mission-create/services/mission-scorm.service';
import { GroupAPI } from 'app/main/group/groups/group.api';
import { MatDialog } from '@angular/material/dialog';
import { GroupDialogComponent } from 'app/main/group/groups/components';
import { Router } from '@angular/router';

const MISSIONS_SERVICE_ID = apps.konquest.services.mission.id;
const TRAILS_SERVICE_ID = apps.konquest.services.learning_trail.id;
const PULSES_SERVICE_ID = apps.konquest.services.pulse.id;
const EVENTS_SERVICE_ID = apps.konquest.services.event.id;

export type CreateLearnContentButtonViewModel = {
  canCreateMissions: boolean;
  canCreateTrails: boolean;
  canCreatePulses: boolean;
  canCreateGroups: boolean;
  canCreateEvents: boolean;
  showMenu: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class CreateLearnContentButtonService {
  private readonly currentWorkspaceServicesIds$: Observable<string[]>;
  private readonly canCreateMissions$: Observable<boolean>;
  private readonly canCreateTrails$: Observable<boolean>;
  private readonly canCreatePulses$: Observable<boolean>;
  private readonly canCreateEvents$: Observable<boolean>;
  readonly createLearnContentButtonViewModel$: Observable<CreateLearnContentButtonViewModel>;

  constructor(
    private workspaceService: WorkspaceService,
    private userProfileService: UserProfileService,
    private scormService: MissionScormService,
    private groupApi: GroupAPI,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.currentWorkspaceServicesIds$ = this.workspaceService.workspaceServices$.pipe(
      map((services) => services?.map((service) => service.id)),
    );

    this.canCreateMissions$ = this.isCreatorAndServiceIsActive(MISSIONS_SERVICE_ID);
    this.canCreateTrails$ = this.isCreatorAndServiceIsActive(TRAILS_SERVICE_ID);
    this.canCreatePulses$ = this.isCreatorAndServiceIsActive(PULSES_SERVICE_ID);
    this.canCreateEvents$ = this.canCreateEvents();
    this.createLearnContentButtonViewModel$ = this.createViewModel();
  }

  private createViewModel(): Observable<CreateLearnContentButtonViewModel> {
    return combineLatest([
      this.canCreateMissions$,
      this.canCreateTrails$,
      this.canCreatePulses$,
      this.canCreateEvents$,
      this.userProfileService.isAdmin$(),
    ]).pipe(
      map(([canCreateMissions, canCreateTrails, canCreatePulses, canCreateEvents, isAdmin]) => ({
        canCreateMissions,
        canCreateTrails,
        canCreatePulses,
        canCreateEvents,
        canCreateGroups: isAdmin,
        showMenu: canCreateMissions || canCreateTrails || canCreatePulses || canCreateEvents || isAdmin,
      })),
    );
  }

  private isCreatorAndServiceIsActive(serviceId: string): Observable<boolean> {
    return combineLatest([
      this.userProfileService.isCurator$(),
      this.currentWorkspaceServicesIds$.pipe(map((servicesIds) => servicesIds?.includes(serviceId))),
    ]).pipe(map(([isCreator, isServiceActive]) => isCreator && isServiceActive));
  }

  private canCreateEvents() {
    return combineLatest([
      this.userProfileService.isCurator$(),
      this.userProfileService.hasRoles$(['instructor']),
      this.currentWorkspaceServicesIds$.pipe(map((servicesIds) => servicesIds?.includes(EVENTS_SERVICE_ID))),
    ]).pipe(map(([isCreator, isInstructor, isServiceActive]) => (isCreator || isInstructor) && isServiceActive));
  }

  createScorm() {
    this.scormService.openScormUploadDialog();
  }

  createGroup() {
    this.dialog
      .open(GroupDialogComponent, {
        width: '450px',
        minWidth: '300px',
        autoFocus: 'dialog',
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((result) => !!result),
        switchMap((result) => this.groupApi.create(result).pipe(take(1))),
      )
      .subscribe(({ id }) => this.router.navigate(['/settings/groups', id]));
  }
}
