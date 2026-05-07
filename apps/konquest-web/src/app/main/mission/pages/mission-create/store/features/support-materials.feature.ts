import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SupportMaterialActions } from 'app/main/mission/pages/mission-create/store';
import { MissionActions } from '../actions';

export interface SupportMaterialsFeatureState extends EntityState<SupportMaterial> {
  loading: boolean;
}

const adapter = createEntityAdapter<SupportMaterial>();

const supportMaterialsInitialState: SupportMaterialsFeatureState =
  adapter.getInitialState<SupportMaterialsFeatureState>({ loading: true });

const reducer = createReducer(
  supportMaterialsInitialState,

  on(
    SupportMaterialActions.loadSupportMaterialsSuccess,
    (state, { supportMaterials }): SupportMaterialsFeatureState => {
      return adapter.setAll(supportMaterials, { ...state, loading: false });
    },
  ),

  on(
    SupportMaterialActions.uploadSupportMaterialSuccess,
    (state, { supportMaterial }): SupportMaterialsFeatureState => {
      return adapter.addOne(supportMaterial, { ...state });
    },
  ),

  on(SupportMaterialActions.deleteSupportMaterialSuccess, (state, { id }): SupportMaterialsFeatureState => {
    return adapter.removeOne(id, { ...state });
  }),

  on(
    MissionActions.resetStore,
    MissionActions.setMissionModel,
    (): SupportMaterialsFeatureState => supportMaterialsInitialState,
  ),
);

export const supportMaterialsFeature = createFeature({
  name: 'supportMaterials',
  reducer,
  extraSelectors: ({ selectSupportMaterialsState, selectLoading }) => {
    return {
      selectViewModel: createSelector(
        adapter.getSelectors(selectSupportMaterialsState).selectAll,
        selectLoading,
        (items, loading) => {
          return {
            items,
            loading,
          };
        },
      ),
    };
  },
});
