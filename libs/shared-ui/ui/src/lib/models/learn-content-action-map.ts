import { marker } from '@jsverse/transloco-keys-manager/marker';
import { LearnContentCardAction, LearnContentCardActionId } from './learn-content-card-action';

export const LEARN_CONTENT_ACTION_MAP: Record<LearnContentCardActionId, LearnContentCardAction> = {
  continue: { id: 'continue', label: marker('UI.MISSION.CARD.ACTIONS.CONTINUE'), icon: 'play_arrow' },
  start: { id: 'start', label: marker('UI.MISSION.CARD.ACTIONS.START'), icon: 'play_arrow' },
  enroll: { id: 'enroll', label: marker('UI.MISSION.CARD.ACTIONS.ENROLL'), icon: 'play_arrow' },
  'request-new-deadline': {
    id: 'request-new-deadline',
    label: marker('UI.MISSION.CARD.ACTIONS.REQUEST_NEW_DEADLINE'),
    icon: 'event',
  },
  details: { id: 'details', label: marker('UI.MISSION.CARD.ACTIONS.DETAILS'), icon: 'add' },
  share: { id: 'share', label: marker('UI.MISSION.CARD.ACTIONS.SHARE'), icon: 'share' },
  'add-bookmark': { id: 'add-bookmark', label: marker('UI.MISSION.CARD.ACTIONS.ADD_BOOKMARK'), icon: 'bookmark_add' },
  'remove-bookmark': {
    id: 'remove-bookmark',
    label: marker('UI.MISSION.CARD.ACTIONS.REMOVE_BOOKMARK'),
    icon: 'bookmark_remove',
  },
} as const;
