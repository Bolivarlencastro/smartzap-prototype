import { MissionDetailEffects } from './effects/mission-detail.effects';
import { MissionOptionsMenuEffects } from './effects/mission-options-menu.effects';

export * from './reducers';
export * from './selectors';
export * from './actions';

export const DETAIL_DIALOG_FEATURE_EFFECTS = [MissionDetailEffects, MissionOptionsMenuEffects];
