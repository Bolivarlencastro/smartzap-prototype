import { Category, Language } from '@app/main/courses/model';
import { CustomMenuItem, SmartzapConfiguration, Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { GlobalSettingsActions } from '../actions';

export interface GlobalSettingsFeatureState {
  workspace: Workspace;
  customMenuItems: CustomMenuItem[];
  languages: Language[];
  categories: Category[];
  smartzapConfiguration: SmartzapConfiguration;
  hasMultipleWorkspaces: boolean;
}

export const globalSettingsInitialState: GlobalSettingsFeatureState = {
  workspace: null,
  customMenuItems: [],
  languages: [],
  categories: [],
  smartzapConfiguration: null,
  hasMultipleWorkspaces: true,
};

const globalSettingsReducer = createReducer(
  globalSettingsInitialState,

  on(
    GlobalSettingsActions.setSettingsOnInit,
    (state, { workspace }): GlobalSettingsFeatureState => ({
      ...state,
      workspace,
      customMenuItems: workspace.custom_menu_items,
    }),
  ),

  on(
    GlobalSettingsActions.setLanguages,
    (state, { languages }): GlobalSettingsFeatureState => ({
      ...state,
      languages,
    }),
  ),

  on(
    GlobalSettingsActions.setCategories,
    (state, { categories }): GlobalSettingsFeatureState => ({
      ...state,
      categories,
    }),
  ),

  on(
    GlobalSettingsActions.updateSmartzapConfigurationSuccess,
    (state, { smartzapConfiguration }): GlobalSettingsFeatureState => ({
      ...state,
      smartzapConfiguration,
    }),
  ),

  on(
    GlobalSettingsActions.updateUserTokenExpirationSuccess,
    (state, { user_token_expiration }): GlobalSettingsFeatureState => ({
      ...state,
      workspace: state.workspace ? { ...state.workspace, user_token_expiration } : state.workspace,
    }),
  ),

  on(
    GlobalSettingsActions.loadWorkspacesSuccess,
    (state, { hasMultipleWorkspaces }): GlobalSettingsFeatureState => ({ ...state, hasMultipleWorkspaces }),
  ),
);

export const globalSettingsFeature = createFeature({
  name: 'globalSettingsFeature',
  reducer: globalSettingsReducer,
  extraSelectors: ({ selectSmartzapConfiguration }) => ({
    selectMessagesContentEmbed: createSelector(
      selectSmartzapConfiguration,
      (smartzapConfiguration): boolean => smartzapConfiguration?.messagesContentEmbed,
    ),
  }),
});
