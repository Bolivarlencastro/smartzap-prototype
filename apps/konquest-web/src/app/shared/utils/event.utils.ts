import { MissionModel } from '@app/main/mission/mission.model';

export function isEvent(model: MissionModel | string): boolean {
  const eventModels = ['LIVE', 'PRESENTIAL'];
  return eventModels.includes(model);
}
