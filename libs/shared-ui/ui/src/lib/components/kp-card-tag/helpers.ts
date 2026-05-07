import { marker } from '@jsverse/transloco-keys-manager/marker';
import { CardTagType } from '../../models';

export const LABELS_MAP = new Map<CardTagType, string>([
  ['development-creating', marker('UI.KP_TAGS.DEVELOPMENT_CREATING')],
  ['development-processing', marker('UI.KP_TAGS.DEVELOPMENT_PROCESSING')],
  ['development-awaiting-review', marker('UI.KP_TAGS.DEVELOPMENT_AWAITING_REVIEW')],
  ['development-published', marker('UI.KP_TAGS.DEVELOPMENT_PUBLISHED')],
  ['development-inactive', marker('UI.KP_TAGS.DEVELOPMENT_INACTIVE')],
  ['development-inactive-by-integration', marker('UI.KP_TAGS.DEVELOPMENT_INACTIVE_BY_INTEGRATION')],
  ['development-finished-event', marker('UI.KP_TAGS.DEVELOPMENT_FINISHED_EVENT')],
  ['enrollment-enrolled', marker('UI.KP_TAGS.ENROLLMENT_ENROLLED')],
  ['enrollment-started', marker('UI.KP_TAGS.ENROLLMENT_STARTED')],
  ['enrollment-expired', marker('UI.KP_TAGS.ENROLLMENT_EXPIRED')],
  ['enrollment-required-new-deadline', marker('UI.KP_TAGS.ENROLLMENT_REQUIRED_NEW_DEADLINE')],
  ['enrollment-finished', marker('UI.KP_TAGS.ENROLLMENT_FINISHED')],
  ['enrollment-awaiting-certificate-approval', marker('UI.KP_TAGS.ENROLLMENT_AWAITING_CERTIFICATE_APPROVAL')],
  ['enrollment-certificate-reproved', marker('UI.KP_TAGS.ENROLLMENT_CERTIFICATE_REPROVED')],
  ['enrollment-give-up', marker('UI.KP_TAGS.ENROLLMENT_GIVE_UP')],
  ['enrollment-inactive', marker('UI.KP_TAGS.ENROLLMENT_INACTIVE')],
  ['enrollment-awaiting-confirmation', marker('UI.KP_TAGS.ENROLLMENT_AWAITING_CONFIRMATION')],
  ['enrollment-refused', marker('UI.KP_TAGS.ENROLLMENT_REFUSED')],
  ['enrollment-confirmed', marker('UI.KP_TAGS.ENROLLMENT_CONFIRMED')],
  ['modifier-required', marker('UI.KP_TAGS.MODIFIER_REQUIRED')],
  ['modifier-normative', marker('UI.KP_TAGS.MODIFIER_NORMATIVE')],
  ['modifier-temporary', marker('UI.KP_TAGS.MODIFIER_TEMPORARY')],
  ['goal-to', marker('UI.KP_TAGS.GOAL_TO')],
  ['goal-expires-in', marker('UI.KP_TAGS.EXPIRES_IN')],
  ['goal-due-by', marker('UI.KP_TAGS.GOAL_DUE_BY')],
  ['model-live', marker('UI.KP_TAGS.MODEL_LIVE')],
  ['model-presential', marker('UI.KP_TAGS.MODEL_PRESENTIAL')],
  ['disabled-section', marker('UI.KP_TAGS.DISABLED_SECTION')],
]);

export const ICONS_MAP = new Map<CardTagType, string>([
  ['modifier-required', 'flag'],
  ['modifier-normative', 'replay'],
  ['modifier-temporary', 'hourglass'],
  ['model-live', 'videocam'],
  ['model-presential', 'location_on'],
]);
