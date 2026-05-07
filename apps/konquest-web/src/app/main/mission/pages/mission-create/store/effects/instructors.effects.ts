import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MissionInstructorsService } from '../../services/mission-instructors.service';
import { MissionActions, MissionInstructorsActions } from '../actions';
import { MissionSelectors } from '../selectors';

@Injectable()
export class InstructorsEffects {
  constructor(
    private _actions$: Actions,
    private store: Store,
    private _missionInstructorsService: MissionInstructorsService,
  ) {}

  loadMissionSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.loadMissionSuccess),
      map(({ mission }) => {
        const instructors = MissionInstructorsService.getInstructorsFromMission(mission);
        return MissionInstructorsActions.setInstructors({ instructors });
      }),
    );
  });

  addInstructor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionInstructorsActions.addInstructor),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMission)),
      switchMap(([{ instructor }, mission]) =>
        this._missionInstructorsService.addInstructor(instructor.id, mission.id).pipe(
          map(() => MissionInstructorsActions.addInstructorSuccess({ instructor })),
          catchError((error) => of(MissionInstructorsActions.addInstructorFailure({ error }))),
        ),
      ),
    );
  });

  removeInstructor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionInstructorsActions.removeInstructor),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMission)),
      switchMap(([{ instructor }, mission]) =>
        this._missionInstructorsService.removeInstructor(instructor.id, mission.id).pipe(
          map(() => MissionInstructorsActions.removeInstructorSuccess({ instructor })),
          catchError((error) => of(MissionInstructorsActions.removeInstructorFailure({ error }))),
        ),
      ),
    );
  });

  registerInstructor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionInstructorsActions.registerInstructor),
      switchMap(({ instructorData }) =>
        this._missionInstructorsService.registerInstructor(instructorData).pipe(
          map((instructor) =>
            MissionInstructorsActions.registerInstructorSuccess({
              instructor: {
                ...instructor,
                avatar: instructorData.avatarData,
              },
            }),
          ),
          catchError((error) => of(MissionInstructorsActions.registerInstructorFailure({ error }))),
        ),
      ),
    );
  });

  registerInstructorSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionInstructorsActions.registerInstructorSuccess),
      map(({ instructor }) => MissionInstructorsActions.addInstructor({ instructor })),
    );
  });

  filterInstructors$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionInstructorsActions.filterInstructors),
      switchMap(({ filter }) =>
        this._missionInstructorsService.filterInstructors(filter).pipe(
          map(({ data }) => MissionInstructorsActions.filterInstructorsSuccess({ instructors: data })),
          catchError((error) => of(MissionInstructorsActions.filterInstructorsFailure({ error }))),
        ),
      ),
    );
  });

  openNewInstructorDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionInstructorsActions.openNewInstructorDialog),
      switchMap(() =>
        this._missionInstructorsService
          .openNewInstructorDialog()
          .pipe(map((instructorData) => MissionInstructorsActions.registerInstructor({ instructorData }))),
      ),
    );
  });
}
