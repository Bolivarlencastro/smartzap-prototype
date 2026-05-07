import { ContributorsEffects } from './effects/contributors.effects';
import { GroupsEffects } from './effects/groups.effects';
import { InstructorsEffects } from './effects/instructors.effects';
import { LoadingEffects } from './effects/loading.effects';
import { MissionInfoEffects } from './effects/mission-info.effects';
import { MissionEffects } from './effects/mission.effects';
import { ProvidersEffects } from './effects/providers.effects';
import { StagesEffects } from './effects/stages.effects';
import { TypesEffects } from './effects/types.effects';
import { SupportMaterialsEffects } from './effects/support-materials.effects';

export * from './reducers';
export * from './selectors';
export * from './actions';
export * from './features';

export const FEATURE_EFFECTS = [
  ContributorsEffects,
  GroupsEffects,
  InstructorsEffects,
  LoadingEffects,
  MissionEffects,
  StagesEffects,
  TypesEffects,
  ProvidersEffects,
  MissionInfoEffects,
  SupportMaterialsEffects,
];
