import { EnrollmentStatuses, MissionListingConfig } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { MissionListingConfigActions } from '../actions';

export interface MissionListingConfigFeatureState extends EntityState<Partial<MissionListingConfig>> {
  workspaceId: string;
}

export const missionListingConfigAdapter = createEntityAdapter<Partial<MissionListingConfig>>();

export const missionListingConfigInitialState: MissionListingConfigFeatureState =
  missionListingConfigAdapter.getInitialState({
    workspaceId: null,
  });

const missionListingConfigReducer = createReducer(
  missionListingConfigInitialState,

  on(
    MissionListingConfigActions.loadConfig,
    (state, { workspaceId, config }): MissionListingConfigFeatureState =>
      missionListingConfigAdapter.setAll(config, {
        ...state,
        workspaceId,
      }),
  ),

  on(
    MissionListingConfigActions.updateConfigSuccess,
    (state, { config, checked }): MissionListingConfigFeatureState =>
      missionListingConfigAdapter.updateOne(
        {
          id: config.id,
          changes: { ...config, is_enabled: checked },
        },
        { ...state },
      ),
  ),

  on(
    MissionListingConfigActions.updateConfigFailure,
    (state, { config }): MissionListingConfigFeatureState =>
      missionListingConfigAdapter.updateOne(
        {
          id: config.id,
          changes: config,
        },
        { ...state },
      ),
  ),
);

export const missionListingConfigFeature = createFeature({
  name: 'missionListingConfigFeature',
  reducer: missionListingConfigReducer,
  extraSelectors: ({ selectMissionListingConfigFeatureState }) => ({
    selectConfig: createSelector(
      missionListingConfigAdapter.getSelectors(selectMissionListingConfigFeatureState).selectAll,
      (items): Partial<MissionListingConfig>[] => {
        const desiredOrder = [
          EnrollmentStatuses.COMPLETED,
          EnrollmentStatuses.GIVE_UP,
          EnrollmentStatuses.REPROVED,
          EnrollmentStatuses.EXPIRED,
          EnrollmentStatuses.INACTIVATED,
          EnrollmentStatuses.REFUSED,
          EnrollmentStatuses.REQUEST_EXTENSION,
          EnrollmentStatuses.PENDING_VALIDATION,
        ];

        const result: Partial<MissionListingConfig>[] = items.map((item) => ({
          ...item,
          label: `ENROLLMENT.STATUS.${item.filter_type}`,
        }));

        const sortedResult = result.sort(
          (a, b) => desiredOrder.indexOf(a.filter_type) - desiredOrder.indexOf(b.filter_type),
        );

        sortedResult.unshift(
          ...[
            { label: 'ENROLLMENT.STATUS.ENROLLED', is_enabled: true, disabled: true },
            { label: 'ENROLLMENT.STATUS.STARTED', is_enabled: true, disabled: true },
          ],
        );

        return sortedResult;
      },
    ),
  }),
});
