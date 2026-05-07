import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';
import { Action } from '@ngrx/store';
import {
  Mission,
  MissionCategory,
  MissionInformationDate,
  MissionModel,
  MissionProvider,
  MissionStage,
  MissionStageContent,
  MissionType,
} from 'app/main/mission/mission.model';
import { ScormSteps } from 'app/main/mission/models';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { defaultIfEmpty, forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { getNavItems } from '../components/mission-nav-menu/mission-nav-items';
import { MissionActions } from '../store';
import { AuthService, KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KeepsError } from '@core/model/error.model';
import { navigateToEvent, navigateToMission } from 'app/shared/services';
import { isEvent } from '@app/shared/utils/event.utils';
import { MatDialog } from '@angular/material/dialog';
import { ImageGeneratorComponent } from '@keeps-platform-frontend-workspace/image-generator';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';

export type ImageDefinition = 'vertical_holder_image' | 'thumb_image' | 'holder_image';
type ImageDimensions = { width: number; height: number };
export type MissionImageUpload = { definition: ImageDefinition; url: string };

export interface FilteredMissionDates {
  updated: MissionInformationDate[];
  created: MissionInformationDate[];
  deleted: MissionInformationDate[];
  untouched: MissionInformationDate[];
}

/**
 * A representation of the grouped request related to a mission event dates.
 */
export type MissionDatesRequestResponse = {
  created: MissionInformationDate[];
  updated: MissionInformationDate[];
  deleted: void[];
};

type PropertyWithId = { id?: string };

const UUID_V4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

@Injectable()
export class MissionCreateService {
  private readonly basePath = '/missions';

  private static getMissionModelPath(missionModel?: MissionModel, isEditingScorm?: boolean): string {
    if (!missionModel || isEditingScorm) {
      return '';
    }

    const missionModelMap = {
      [MissionModel.LIVE]: MissionModel.LIVE.toLowerCase(),
      [MissionModel.PRESENTIAL]: MissionModel.PRESENTIAL.toLowerCase(),
      [MissionModel.SCORM]: MissionModel.SCORM.toLowerCase(),
      [MissionModel.EXTERNAL_PROVIDER]: 'external',
    };
    return missionModelMap[missionModel] ? `/${missionModelMap[missionModel]}` : '';
  }

  static checkIsMissionModel(missionModel: string): MissionModel | undefined {
    const upperCasedMissionModel = missionModel?.toUpperCase();
    return MissionModel[upperCasedMissionModel] || undefined;
  }

  static checkMissionModelOrId(missionModelOrId: string):
    | ({
        missionModel: MissionModel;
      } & Action<'[MISSION CREATION] Set Mission Model'>)
    | ({
        missionId: string;
      } & Action<'[MISSION CREATION] Load Mission'>) {
    const missionModel = MissionCreateService.checkIsMissionModel(missionModelOrId);
    if (missionModel) {
      return MissionActions.setMissionModel({ missionModel: missionModel });
    }
    return MissionActions.loadMission({ missionId: missionModelOrId });
  }

  static filterNavigationEvents(
    missionModelOrID: string | undefined,
    currentMissionModel: MissionModel | undefined,
    missionLoaded: boolean,
    currentId: string,
  ): boolean {
    // If no mission model is present, we refuse the navigation event
    if (!missionModelOrID) {
      return false;
    }

    const validCourseID = UUID_V4_REGEX.test(missionModelOrID);
    // If there's no course id, but a missionModel is currently set in the store,
    // we allow events were the current one is different from the new one
    if (!validCourseID && currentMissionModel) {
      const newMissionModel = MissionCreateService.checkIsMissionModel(missionModelOrID);
      const differentMissionModels = currentMissionModel !== newMissionModel;

      return differentMissionModels ? true : missionLoaded;
    }

    if (missionModelOrID !== currentId) {
      return true;
    }

    return !missionLoaded || !currentMissionModel;
  }

  static groupMissionDates(dates: MissionInformationDate[]): FilteredMissionDates {
    const results: FilteredMissionDates = { created: [], deleted: [], untouched: [], updated: [] };

    dates.forEach((date) => {
      if (date.deleted) {
        results.deleted.push(date);
        return;
      }

      if (date.id && date.touched) {
        results.updated.push(date);
        return;
      }

      if (!date.id) {
        results.created.push(date);
        return;
      }

      results.untouched.push(date);
    });

    return results;
  }

  static getMissionWithImagesDefinitions(images: MissionImageUpload[]): Partial<Mission> {
    const mission: Partial<Mission> = {};

    images.forEach((definition) => {
      mission[definition.definition] = definition.url;
    });

    return mission;
  }

  constructor(
    private _http: KonquestAPI,
    private _authService: AuthService,
    private _messageService: KpMessageService,
    private _router: Router,
    private _dialog: MatDialog,
  ) {}

  publishMission(missionId: string): Observable<Mission> {
    return this._http.post<Mission>(`${this.basePath}/${missionId}/publish`, {}).pipe(
      tap({
        error: (error: KeepsError) => this._messageService.error(error.error.detail),
      }),
    );
  }

  navigateToMissions(): void {
    this._router.navigate(['/missions']);
  }

  navigateToMission(missionId: string, missionModel: MissionModel): void {
    if (isEvent(missionModel)) {
      navigateToEvent(this._router, missionId, false, true);
      return;
    }

    navigateToMission(this._router, missionId, false, true);
  }

  loadStages(missionId: string): Observable<MissionStage[]> {
    return this._http.get<Pagination<MissionStage>>(`${this.basePath}/${missionId}/stages`).pipe(
      tap({
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.LOAD_STAGES')),
      }),
      map(({ results }) =>
        results?.map((stage: MissionStage) => {
          stage.contents = KeepsUtils.orderBy(stage.contents, ['order'], ['asc']);
          return stage;
        }),
      ),
    );
  }

  saveStage(stage: MissionStage, missionId: string): Observable<MissionStage> {
    return this._http.post<MissionStage>(`${this.basePath}/stages`, { ...stage, mission: missionId }).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.TOPIC.ADD.SUCCESS')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.ADD_TOPIC')),
      }),
      map((stage) => ({ ...stage, contents: [] })),
    );
  }

  editStage({ id, name, description }: MissionStage): Observable<MissionStage> {
    return this._http.patch<MissionStage>(`${this.basePath}/stages/${id}`, { name, description }).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.TOPIC_EDIT')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.TOPIC_EDIT')),
      }),
    );
  }

  removeStage(id: string): Observable<any> {
    return this._http.delete<unknown>(`${this.basePath}/stages/${id}`).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.TOPIC_REMOVED')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.TOPIC_REMOVED')),
      }),
    );
  }

  reorderStages(stages: MissionStage[]): Observable<any> {
    const simplifiedStages = stages.map((stage) => ({ stage: stage.id, order: stage.order }));
    return this._http.patch(`${this.basePath}/stages/reorder`, simplifiedStages).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.ORDER_STAGES')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.ORDER_STAGES')),
      }),
    );
  }

  reorderStageContents(contents: MissionStageContent[]): Observable<any> {
    const simplifiedContents = contents.map((content) => ({ content: content.id, order: content.order }));

    return this._http.patch(`${this.basePath}/stages/contents/reorder`, simplifiedContents).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.ORDER_CONTENT')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.ORDER_CONTENT')),
      }),
    );
  }

  deleteStageContent(contentId: string): Observable<unknown> {
    return this._http.delete(`${this.basePath}/stages/contents/${contentId}`).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.CONTENT_REMOVED')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.CONTENT_REMOVED')),
      }),
    );
  }

  editStageContent(content: MissionStageContent): Observable<any> {
    const { id, name, description } = content;
    return this._http.patch(`${this.basePath}/stages/contents/${id}`, { name, description }).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.CONTENT_EDIT')),
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.CONTENT_EDIT')),
      }),
    );
  }

  uploadMissionImage(
    image: File,
    definitions: ImageDefinition[] = ['holder_image', 'thumb_image', 'vertical_holder_image'],
  ): Observable<MissionImageUpload[]> {
    return forkJoin<MissionImageUpload[]>(this.postImagesBySize(image, definitions)).pipe(
      tap({
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.IMAGE_UPLOAD')),
      }),
    );
  }

  getCategories(): Observable<Pagination<MissionCategory>> {
    return this._http.get<Pagination<MissionCategory>>(`${this.basePath}/categories`);
  }

  getTypes(): Observable<Pagination<MissionType>> {
    return this._http.get<Pagination<MissionType>>(`${this.basePath}/types`);
  }

  getProviders(search: string): Observable<Pagination<MissionProvider>> {
    return this._http.get<Pagination<MissionProvider>>(`${this.basePath}/providers`, { search, per_page: 20 });
  }

  createMission(mission: Mission, missionModel?: MissionModel, scormSteps?: ScormSteps[]): Observable<Mission> {
    const patchedMission = this.patchMission(mission, missionModel, scormSteps);
    const missionModelPath = MissionCreateService.getMissionModelPath(missionModel);

    return this._http
      .post<Mission>(`${this.basePath}${missionModelPath}`, {
        ...patchedMission,
        user_creator: this._authService.userId,
      })
      .pipe(
        tap({
          next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.CREATE_MISSION')),
          error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.CREATE_MISSION')),
        }),
      );
  }

  updateMission(mission: Partial<Mission>, missionModel?: MissionModel): Observable<Mission> {
    const patchedMission = this.patchMission(mission);
    const missionModelPath = MissionCreateService.getMissionModelPath(
      missionModel,
      missionModel === MissionModel.SCORM,
    );

    return this._http.patch<Mission>(`${this.basePath}${missionModelPath}/${mission.id}`, patchedMission).pipe(
      tap({
        next: () => this._messageService.success(marker('MISSION.CREATE.SUCCESS.UPDATE_MISSION')),
        error: (error) => this._messageService.error(`MISSION.CREATE.ERROR.${error?.error?.i18n}`),
      }),
    );
  }

  manageMissionDates(
    dates: FilteredMissionDates,
    missionId: string,
    missionModel: MissionModel,
  ): Observable<MissionDatesRequestResponse> {
    const createRequest = forkJoin(
      dates.created.map((createdDate) => this.createMissionDate(createdDate, missionId, missionModel)),
    ).pipe(defaultIfEmpty([]));

    const updateRequest: Observable<MissionInformationDate[]> = forkJoin(
      dates.updated.map((updatedDate) => this.editMissionDate(updatedDate, missionId, missionModel)),
    ).pipe(defaultIfEmpty([]));

    const deleteRequest: Observable<void[]> = forkJoin(
      dates.deleted.map((deletedDate) => this.removeMissionDate(deletedDate.id, missionId, missionModel)),
    ).pipe(defaultIfEmpty([]));

    return forkJoin([createRequest, updateRequest, deleteRequest]).pipe(
      map(([created, updated, deleted]) => {
        return { created, updated, deleted };
      }),
      tap({ error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.SAVE_DATES')) }),
    );
  }

  navigateNextStep(missionID: string, missionModel: MissionModel): void {
    const nextStepRoute = this.getNextStep(missionModel, this._router.url);
    const path = isEvent(missionModel) ? 'events' : 'missions';

    this._router.navigate([`/${path}/create`, missionID, nextStepRoute], { state: { missionSaved: true } });
  }

  navigatePreviousStep(missionID: string, missionModel: MissionModel): void {
    const previousStepRoute = this.getPreviousStep(missionModel, this._router.url);
    const path = isEvent(missionModel) ? 'events' : 'missions';

    this._router.navigate([`/${path}/create`, missionID, previousStepRoute]);
  }

  openImageGenDialog(uploadImageType: 'banner' | 'card', rootImage: File | string): Observable<any> {
    const uploadType = uploadImageType === 'banner' ? 'COURSE_BANNER' : 'COURSE_CARD';

    return this._dialog
      .open<ImageGeneratorComponent>(ImageGeneratorComponent, {
        width: '80vw',
        height: '80vh',
        autoFocus: 'dialog',
        data: {
          uploadType,
          rootImage,
        },
        disableClose: true,
      })
      .afterClosed();
  }

  openReuseGeneratedImageDialog(uploadImageType: 'banner' | 'card') {
    const confirmMessage =
      uploadImageType === 'banner'
        ? 'MISSION.CREATE.REUSE_GENERATED_IMAGE.BANNER_MESSAGE'
        : 'MISSION.CREATE.REUSE_GENERATED_IMAGE.CARD_MESSAGE';

    const dialogRefConfirm = this._dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRefConfirm.componentInstance.confirmTitle = 'MISSION.CREATE.REUSE_GENERATED_IMAGE.TITLE';
    dialogRefConfirm.componentInstance.confirmMessage = confirmMessage;
    dialogRefConfirm.componentInstance.positiveButtonLabel =
      'MISSION.CREATE.REUSE_GENERATED_IMAGE.POSITIVE_BUTTON_LABEL';
    dialogRefConfirm.componentInstance.negativeButtonLabel =
      'MISSION.CREATE.REUSE_GENERATED_IMAGE.NEGATIVE_BUTTON_LABEL';

    return dialogRefConfirm.afterClosed();
  }

  private getNextStep(missionModel: MissionModel, currentRoute: string): string {
    const currentStepRoute = currentRoute.split('/').pop();
    const navItems = getNavItems(missionModel);
    const currentStepIndex = navItems.findIndex((item) => item.route === currentStepRoute);
    const nextStep = navItems?.at(currentStepIndex + 1);
    return nextStep?.route || 'info';
  }

  private getPreviousStep(missionModel: MissionModel, currentRoute: string): string {
    const currentStepRoute = currentRoute.split('/').pop();
    const navItems = getNavItems(missionModel);
    const currentStepIndex = navItems.findIndex((item) => item.route === currentStepRoute);
    const nextStep = navItems?.at(currentStepIndex - 1);
    return nextStep?.route || 'info';
  }

  private patchMission(originalMission: Mission, missionModel?: MissionModel, scormSteps?: ScormSteps[]): Mission {
    const mission = structuredClone<Mission>(originalMission);

    mission.mission_category = this.patchPropertyWithId(mission.mission_category);
    mission.mission_type = this.patchPropertyWithId(mission.mission_type);

    if (missionModel) {
      mission.mission_model = missionModel;
    }

    if (scormSteps) {
      mission.steps = scormSteps;
    }

    this.patchExternalInfo(mission);
    this.removeUserCreatorProperty(mission);
    return mission;
  }

  private patchExternalInfo(mission: Mission) {
    if (mission.mission_model !== MissionModel.EXTERNAL_PROVIDER || !mission.external?.provider) {
      return;
    }

    mission.external.provider = this.patchPropertyWithId(mission.external.provider);
  }

  private removeUserCreatorProperty(mission: Mission): void {
    delete mission.user_creator;
  }

  private patchPropertyWithId(property: PropertyWithId | string): string {
    if (this.hasId(property)) {
      return property?.id;
    }

    return property;
  }

  private hasId(item?: PropertyWithId | string): item is PropertyWithId {
    return typeof item === 'object' && item !== null && 'id' in item;
  }

  private postImagesBySize(imageFile: File, definitions: ImageDefinition[]): Observable<MissionImageUpload>[] {
    return definitions.map((imageDefinition) => this.postImage(imageFile, imageDefinition));
  }

  private postImage(imageFile: File, imageDefinition: ImageDefinition): Observable<MissionImageUpload> {
    const dimensionsMap: Record<ImageDefinition, ImageDimensions> = {
      holder_image: { width: 1920, height: 640 },
      thumb_image: { width: 320, height: 568 },
      vertical_holder_image: { width: 320, height: 568 },
    };

    const imageDimensions = dimensionsMap[imageDefinition];

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('width', imageDimensions.width.toString());
    formData.append('height', imageDimensions.height.toString());

    return this._http.postFormData<{ url: string }>(`/learn-contents/cover-images-by-size`, formData).pipe(
      tap({
        error: () => this._messageService.error(marker('MISSION.CREATE.ERROR.IMAGE_UPLOAD')),
      }),
      map(({ url }) => {
        return { definition: imageDefinition, url };
      }),
    );
  }

  private createMissionDate(
    date: MissionInformationDate,
    missionId: string,
    missionModel: MissionModel,
  ): Observable<MissionInformationDate> {
    const missionModelPath = MissionCreateService.getMissionModelPath(missionModel);

    return this._http
      .post<MissionInformationDate>(`${this.basePath}${missionModelPath}/${missionId}/dates`, date)
      .pipe(tap({ error: (error) => this._messageService.error(error.error.detail[0]) }));
  }

  private removeMissionDate(id: string, missionId: string, missionModel: MissionModel): Observable<void> {
    const missionModelPath = MissionCreateService.getMissionModelPath(missionModel);

    return this._http
      .delete<void>(`${this.basePath}${missionModelPath}/${missionId}/dates/${id}`)
      .pipe(tap({ error: (error) => this._messageService.error(error.error.detail[0]) }));
  }

  private editMissionDate(
    date: MissionInformationDate,
    missionId: string,
    missionModel: MissionModel,
  ): Observable<MissionInformationDate> {
    const missionModelPath = MissionCreateService.getMissionModelPath(missionModel);

    return this._http
      .patch<MissionInformationDate>(`${this.basePath}${missionModelPath}/${missionId}/dates/${date.id}`, date)
      .pipe(tap({ error: (error) => this._messageService.error(error.error.detail[0]) }));
  }
}
