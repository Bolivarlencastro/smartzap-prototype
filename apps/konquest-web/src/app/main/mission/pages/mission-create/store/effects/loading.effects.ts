import { Injectable } from '@angular/core';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import {
  MissionActions,
  MissionContentActions,
  MissionGroupsActions,
  MissionInstructorsActions,
  MissionStageActions,
  MissionTypesActions,
} from '../actions';

@Injectable()
export class LoadingEffects {
  static readonly SHOW_LOADING_ACTIONS = [
    MissionActions.loadMission,
    MissionActions.saveMission,
    MissionActions.publishMission,
    MissionActions.updateMissionImage,
    MissionStageActions.loadStages,
    MissionStageActions.editStage,
    MissionStageActions.removeStage,
    MissionStageActions.reorderStages,
    MissionContentActions.editStageContent,
    MissionContentActions.deleteStageContent,
    MissionContentActions.reorderStageContent,
    MissionContentActions.uploadFile,
    MissionTypesActions.loadTypes,
    MissionInstructorsActions.filterInstructors,
    MissionGroupsActions.loadGroups,
    MissionGroupsActions.filterGroups,
  ];

  static readonly HIDE_LOADING_ACTIONS = [
    MissionActions.loadMissionSuccess,
    MissionActions.loadMissionFailure,
    MissionActions.createMissionSuccess,
    MissionActions.updateMissionSuccess,
    MissionActions.saveMissionFailure,
    MissionActions.publishMissionSuccess,
    MissionActions.publishMissionFailure,
    MissionActions.updateMissionImageSuccess,
    MissionActions.updateMissionImageFailure,
    MissionStageActions.loadStagesSuccess,
    MissionStageActions.loadStagesFailure,
    MissionContentActions.editStageContentSuccess,
    MissionContentActions.editStageContentFailure,
    MissionContentActions.deleteStageContentSuccess,
    MissionContentActions.deleteStageContentFailure,
    MissionInstructorsActions.filterInstructorsSuccess,
    MissionInstructorsActions.filterInstructorsFailure,
    MissionGroupsActions.loadGroupsSuccess,
    MissionGroupsActions.loadGroupsFailure,
    MissionGroupsActions.filterGroupsSuccess,
    MissionGroupsActions.filterGroupsFailure,
    MissionTypesActions.skipTypesLoad,
    MissionTypesActions.loadTypesSuccess,
    MissionTypesActions.loadTypesFailure,
  ];

  constructor(
    private _fuseLoadingService: FuseLoadingService,
    private _actions$: Actions,
  ) {}

  showLoading$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(...LoadingEffects.SHOW_LOADING_ACTIONS),
        map(() => {
          this._fuseLoadingService.show();
        }),
      );
    },
    { dispatch: false },
  );

  hideLoading$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(...LoadingEffects.HIDE_LOADING_ACTIONS),
        map(() => {
          this._fuseLoadingService.hide();
        }),
      );
    },
    { dispatch: false },
  );
}
