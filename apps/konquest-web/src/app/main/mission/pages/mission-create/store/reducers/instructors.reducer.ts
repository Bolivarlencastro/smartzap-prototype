import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MissionInstructor } from 'app/main/mission/mission.model';
import { MissionActions, MissionInstructorsActions } from '../actions';

export const instructorsFeatureKey = 'mission-instructors';

export interface MissionInstructorsState extends EntityState<MissionInstructor> {
  filteredInstructors: MissionInstructor[];
}

export const adapter = createEntityAdapter<MissionInstructor>();

export const initialState: MissionInstructorsState = adapter.getInitialState({
  filteredInstructors: [],
});

export const instructorsReducer = createReducer(
  initialState,

  on(
    MissionInstructorsActions.setInstructors,
    (state, { instructors }): MissionInstructorsState => adapter.setAll(instructors, state),
  ),

  on(
    MissionInstructorsActions.addInstructorSuccess,
    (state, { instructor }): MissionInstructorsState => adapter.addOne(instructor, state),
  ),

  on(
    MissionInstructorsActions.removeInstructorSuccess,
    (state, { instructor }): MissionInstructorsState => adapter.removeOne(instructor.id, state),
  ),

  on(
    MissionInstructorsActions.filterInstructorsSuccess,
    (state, { instructors }): MissionInstructorsState => ({
      ...state,
      filteredInstructors: instructors,
    }),
  ),

  on(MissionActions.resetStore, MissionActions.setMissionModel, (): MissionInstructorsState => initialState),
);

export const { selectAll } = adapter.getSelectors();
