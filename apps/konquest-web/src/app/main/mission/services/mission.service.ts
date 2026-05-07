import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KonquestAPI } from '@core/api';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { Enrollment, EnrollmentFilter } from '@core/model/enrollment.model';
import {
  AluraIntegrationsApi,
  AuthService,
  DevelopmentStatus,
  EnrollmentStatuses,
  KeepsUtils,
  Pagination,
  SupportMaterial,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { TranslocoService } from '@jsverse/transloco';
import { EvaluationService } from 'app/main/evaluation/evaluation.service';
import {
  Mission,
  MissionCategory,
  MissionInformationDate,
  MissionModel,
  MissionProvider,
  MissionStage,
  MissionTag,
  SupportMaterialCreateDto,
} from 'app/main/mission/mission.model';
import { KpCardStatus } from 'app/shared/models';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { ReportService } from 'app/shared/services/report.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { differenceInDays, format, isBefore, isSameDay } from 'date-fns';
import { KpStatusChipColor } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';
import { Evaluation } from '@core/model/evaluation.model';

@Injectable({ providedIn: 'root' })
export class MissionServiceV2 {
  private basePath = '/missions';

  constructor(
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
    private _authService: AuthService,
    private _translateService: TranslocoService,
    private _fuseLoadingService: FuseLoadingService,
    private _evaluationService: EvaluationService,
    private _reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _enrollmentApi: MissionEnrollmentsAPI,
    private _aluraIntegrationApi: AluraIntegrationsApi,
  ) {}

  bookmark(mission: string): Observable<{ id: string }> {
    return this._http.post(`${this.basePath}/bookmarks`, {
      mission,
      user: this._authService.userId,
    });
  }

  removeBookmark(bookmarkId: string | undefined): Observable<void> {
    return this._http.delete(`${this.basePath}/bookmarks/${bookmarkId}`);
  }

  fetchProviders(params?: Record<string, unknown>): Observable<Pagination<MissionProvider>> {
    return this._http.get<Pagination<MissionProvider>>(`${this.basePath}/providers`, {
      has_linked_mission: true,
      ...params,
    });
  }

  fetchCategories(): Observable<Pagination<MissionCategory>> {
    return this._http.get<Pagination<MissionCategory>>(`${this.basePath}/categories`);
  }

  fetchMissions(params?: Record<string, unknown>): Observable<Pagination<Mission>> {
    return this._http.get<Pagination<Mission>>(this.basePath, {
      ...params,
      faster: true,
    });
  }

  fetchRecommendedMissions(params?: Record<string, unknown>): Observable<Pagination<Mission>> {
    return this._http.get<Pagination<Mission>>(`${this.basePath}/my-recommendations`, params);
  }

  fetchEnrollmentMissions(params?: EnrollmentFilter): Observable<Pagination<Enrollment>> {
    return this._http.get<Pagination<Enrollment>>(`/mission-enrollments/v2`, params);
  }

  fetchEnrollmentByMissionId(id: string): Observable<Enrollment> {
    return this._http.get<Enrollment>(`/mission-enrollments/${id}`);
  }

  fetchMissionById(id: string): Observable<Mission> {
    return this._http.get<Mission>(`${this.basePath}/${id}`);
  }

  finishEnrollmentMission(id: string | undefined): Observable<Mission> {
    return this._http.post<Mission>(`/mission-enrollments/${id}/finish`, {});
  }

  syncFinishEnrollmentMission(id: string): Observable<Mission> {
    return this._http.post<Mission>(`/mission-enrollments/${id}/sync-finish`, {});
  }

  missionGiveUp(id: string, description: string): Observable<Enrollment> {
    return this._enrollmentApi.giveUp(id, description);
  }

  missionRetake(id: string, goal_date?: string): Observable<any> {
    return this._http.patch<any>(`/mission-enrollments/${id}/retake`, { ...(!!goal_date && { goal_date }) });
  }

  removeMission(id: string, isIntegrationMission = false): Observable<any> {
    return this.getDeleteStrategy(id, isIntegrationMission).pipe(
      tap({
        next: () => this._messageService.success('MISSION.DETAIL.MESSAGE_DELETE_SUCCESS'),
        error: () => this._messageService.error('MISSION.DETAIL.MESSAGE_DELETE_ERROR'),
      }),
    );
  }

  fetchSupportMaterials(mission_id: string): Observable<SupportMaterial[]> {
    return this._http.get<SupportMaterial[]>('/supplementary-materials', { mission_id });
  }

  createSupportMaterial(supportMaterial: SupportMaterialCreateDto) {
    return this._http.post<SupportMaterial>('/supplementary-materials', supportMaterial);
  }

  deleteSupportMaterial(id: string) {
    return this._http.delete<void>(`/supplementary-materials/${id}`);
  }

  private getDeleteStrategy(missionId: string, isIntegrationMission: boolean) {
    if (isIntegrationMission) {
      return this._aluraIntegrationApi.deleteCourseByMissionId(missionId);
    }
    return this._http.delete<unknown>(`${this.basePath}/${missionId}`);
  }

  finishMission(id: string, missionModel?: MissionModel): Observable<void> {
    return this._http
      .post<void>(`${this.basePath}${this.getMissionModelPath(missionModel)}/${id}/complete`, {})
      .pipe(tap(() => this._messageService.success(marker('MISSION.SUCCESSFULLY_COMPLETED'))));
  }

  /**
   * Submit the external mission certificate for approval
   *
   * @param enrollmentId mission enrollment id
   * @param certificate certificate file
   */
  submitCertificate(enrollmentId: string, certificate: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', certificate);
    this._fuseLoadingService.show();
    return this._http.postFormData<any>(`/mission-enrollments/${enrollmentId}/external-review`, formData).pipe(
      tap(() => this._messageService.success(marker('MISSION.SUCCESS.CERTIFICATE_SUBMITTED'))),
      finalize(this._fuseLoadingService.hide),
      catchError((error) => {
        this.handleMessageError(error);
        return throwError(() => error);
      }),
    );
  }

  private handleMessageError(error: any, message?: string) {
    if (!error && !error?.error) {
      return;
    }

    if (error.error.detail) {
      this._messageService.error(error.error.detail);
      return;
    }

    if (error.error?.i18n) {
      this._messageService.error(`MISSION.ERROR.${error.error?.i18n}`);
      return;
    }

    if (message) {
      this._messageService.error(message);
    }
  }

  loadHistory(enrollmentId: string): Observable<any> {
    return this._http.get<any>(`/mission-enrollments/${enrollmentId}`).pipe(map(({ approve_msg }) => approve_msg));
  }

  enroll(missionId: string | undefined, userId: string, goalDate?: string): Observable<Enrollment> {
    const body: Record<string, string> = {
      user: userId,
      mission: missionId,
    };

    if (goalDate) {
      body['goal_date'] = format(new Date(goalDate), 'yyyy-MM-dd HH:mm');
    }

    return this._http.post<Enrollment>('/mission-enrollments', body).pipe(
      tap(() => this._messageService.success(marker('MISSION.SUCCESS.REGISTRATION_COMPLETED'))),
      catchError((error) => {
        this.handleMessageError(error, marker('MISSION.ERROR.REGISTRATION_COMPLETED'));
        return throwError(() => error);
      }),
    );
  }

  enrollToLivePresentialMission(mission: string, user: string): Observable<Enrollment> {
    return this._http.post<Enrollment>('/mission-enrollments/sync', { mission, user }).pipe(
      tap(() => this._messageService.success(marker('MISSION.SUCCESS.REGISTRATION_COMPLETED'))),
      catchError((error) => {
        this.handleMessageError(error, marker('MISSION.ERROR.REGISTRATION_COMPLETED'));
        return throwError(() => error);
      }),
    );
  }

  markAsPresentToLiveMission(dates: MissionInformationDate[]) {
    const date_id = this.getDateIdForCurrentEvent(dates);
    return this._http.post('/mission-enrollments/attendances/auto-check', { date_id });
  }

  private getDateIdForCurrentEvent(dates: MissionInformationDate[]): string | null {
    const now = new Date();
    const currentDate = dates?.find((date) => now >= new Date(date.start_at) && now <= new Date(date.end_at));
    return currentDate?.id ?? null;
  }

  fetchStages(missionId: string): Observable<MissionStage[]> {
    return this._http.get<Pagination<MissionStage>>(`${this.basePath}/${missionId}/stages`).pipe(
      map(({ results }) =>
        (results ?? []).map((stage: MissionStage) => {
          stage.contents = KeepsUtils.orderBy(stage.contents, ['order'], ['asc']);
          return stage;
        }),
      ),
      catchError((error) => {
        this._messageService.error(marker('MISSION.ERROR.SEARCH_TOPIC'));
        return throwError(() => error);
      }),
    );
  }

  /**
   * Check an user content as completed
   *
   * @param content content id
   */
  userContentDone(content: string | undefined): Observable<any> {
    return this._http.post('/users/mission-contents', {
      user: this._authService.userId,
      content,
    });
  }

  /**
   * Check an user stage as completed
   *
   * @param stage stage id
   */
  userStageDone(stage: string | undefined): Observable<unknown> {
    return this._http.post('/users/mission-stages', {
      user: this._authService.userId,
      stage,
    });
  }

  // TAGS
  removeTag(id: string): Observable<unknown> {
    return this._http.delete(`${this.basePath}/tags/${id}`);
  }

  createTag(mission: string, name: string): Observable<MissionTag> {
    return this._http.post<MissionTag>(`${this.basePath}/tags`, { mission, name });
  }

  // SUMMARY
  updateSummary(mission: string, summary: string): Observable<unknown> {
    return this._http.patch<unknown>(`${this.basePath}/${mission}`, { summary }).pipe(
      catchError((error) => {
        this._messageService.error('MISSION.ERROR.EDIT_RESUME');
        return error;
      }),
    );
  }

  updateLiveMissionSummary(missionId: string, description: string): Observable<unknown> {
    const body = { description };

    return this._http.patch<unknown>(`${this.basePath}/live/${missionId}`, body).pipe(
      catchError((error) => {
        this._messageService.error('MISSION.ERROR.EDIT_RESUME');
        return error;
      }),
    );
  }

  changeMissionStatus(
    mission: string,
    status:
      | DevelopmentStatus.PROCESSING
      | DevelopmentStatus.IN_PROGRESS
      | DevelopmentStatus.IN_REVIEW
      | DevelopmentStatus.DONE,
  ): Observable<Mission> {
    const data = { development_status: status };
    return this._http.patch<Mission>(`${this.basePath}/${mission}`, data).pipe(
      catchError((error) => {
        this._messageService.error('MISSION.ERROR.EDIT_STATUS_MISSION');
        return error as Observable<Mission>;
      }),
    );
  }

  buildStatuses(mission: Mission, enrollment?: Enrollment): KpCardStatus[] {
    if (!mission) {
      return [];
    }

    const statuses = [];
    const addToStatuses = {
      [EnrollmentStatuses.ENROLLED]: () =>
        statuses.push({
          label: this._translateService.translate('MISSION.DETAIL.ENROLLED'),
          color: KpStatusChipColor.GREEN,
        }),
    };

    const missionModelInformation = mission[mission.mission_model?.toLocaleLowerCase() as keyof Mission];

    if (missionModelInformation) {
      if (!missionModelInformation.is_finished && enrollment?.status) {
        this.addEnrollmentStatus(addToStatuses, enrollment.status);
        this.checkMissionDates(missionModelInformation, statuses);
        this.checkCloseToEnd(missionModelInformation, statuses);
      }

      if (missionModelInformation.is_finished && enrollment) {
        this.addFinishedStatuses(mission, enrollment, statuses);
      }
    }

    return statuses;
  }

  buildExtraMissionAttributes(mission: Mission): Mission {
    const missionModelInformation = mission[mission.mission_model?.toLowerCase() as keyof Mission];
    const lastDate = missionModelInformation.dates?.[missionModelInformation.dates.length - 1]?.end_at;
    const today = new Date();

    missionModelInformation.dates.forEach((date: MissionInformationDate) => {
      date.is_today = isSameDay(new Date(date.start_at), today);
    });
    missionModelInformation.is_finished = lastDate ? isBefore(new Date(lastDate), today) : false;

    return mission;
  }

  generateCertificate(id: string): Observable<any> {
    this._snackBar.openFromComponent(KpSnackLoadingComponent, {
      data: { message: 'GENERAL.LOADING_CERTIFICATE' },
      horizontalPosition: 'center',
      panelClass: ['mat-toolbar', 'bg-white', 'text-black', 'text-base'],
    });

    return this._reportService.generateCourseCertificate(id).pipe(
      tap({
        next: ({ certificate_url }) => {
          this._snackBar.dismiss();
          this._reportService.openCertificate(certificate_url);
        },
        error: () => this._snackBar.dismiss(),
      }),
    );
  }

  formatEvaluations(payload: Pagination<Evaluation>): Pagination<Evaluation> {
    return {
      ...payload,
      results: payload.results?.map(
        (evaluation) =>
          ({
            ...evaluation,
            questions_rating_avg: evaluation.questions_rating_avg ? evaluation.questions_rating_avg.toFixed(1) : 0,
          }) as Evaluation,
      ),
    };
  }

  private getMissionModelPath(missionModel?: MissionModel): string {
    return missionModel ? `/${missionModel.toLowerCase()}` : '';
  }

  private addEnrollmentStatus(addToStatuses: any, status: string): void {
    addToStatuses[
      status as keyof {
        ENROLLED: () => number;
      }
    ]?.();
  }

  private checkMissionDates(missionModelInformation: any, statuses: KpCardStatus[]): void {
    if (missionModelInformation.dates.some((date: MissionInformationDate) => date.is_today)) {
      statuses.push({
        label: this._translateService.translate('MISSION.DETAIL.IS_TODAY'),
        color: KpStatusChipColor.BLUE,
      });
    }
  }

  private checkCloseToEnd(missionModelInformation: any, statuses: KpCardStatus[]): void {
    const lastDate = missionModelInformation.dates?.[missionModelInformation.dates.length - 1]?.end_at;
    const endAtDiff = lastDate?.end_at ? differenceInDays(new Date(lastDate.end_at), new Date()) : undefined;
    if (endAtDiff > 0 && endAtDiff <= 5) {
      statuses.push({
        label: this._translateService.translate(
          `MISSION.DETAIL.CLOSE_TO_END.${endAtDiff === 1 ? 'SINGULAR' : 'PLURAL'}`,
          {
            value: endAtDiff,
          },
        ),
        color: KpStatusChipColor.ORANGE,
      });
    }
  }

  private addFinishedStatuses(mission: Mission, enrollment: Enrollment, statuses: KpCardStatus[]): void {
    if (!enrollment.attended) {
      statuses.push({
        label: this._translateService.translate('MISSION.DETAIL.DID_NOT_ATTEND'),
        color: KpStatusChipColor.RED,
      });
    }

    if (enrollment.attended) {
      statuses.push({
        label: this._translateService.translate('MISSION.DETAIL.ATTENDED'),
        color: KpStatusChipColor.GREEN,
      });
    }

    if (!enrollment.evaluated && mission.required_evaluation && enrollment?.attended) {
      statuses.push({
        label: this._translateService.translate('MISSION.DETAIL.PLEASE_EVALUATE_EVENT'),
        color: KpStatusChipColor.ORANGE,
      });
    }
  }
}
