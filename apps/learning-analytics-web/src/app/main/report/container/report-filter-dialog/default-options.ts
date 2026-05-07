import { KpFilterOption, KpFilterOptionType } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const LANGUAGE_DEFAULT_OPTION: KpFilterOption = {
  filterKey: 'language__in',
  label: marker('GENERAL.LANGUAGE'),
  type: 'selectMultiple',
  options: [
    {
      label: marker('LANGUAGE.PORTUGUESE'),
      value: 'pt-BR',
    },
    {
      label: marker('LANGUAGE.SPANISH'),
      value: 'es',
    },
    {
      label: marker('LANGUAGE.ENGLISH'),
      value: 'us',
    },
  ],
};

export const LEARNING_TRAIL_LANGUAGE_DEFAULT_OPTION: KpFilterOption = {
  filterKey: 'learning_trail__language__in',
  label: marker('GENERAL.LANGUAGE'),
  type: 'selectMultiple',
  options: [
    {
      label: marker('LANGUAGE.PORTUGUESE'),
      value: 'pt-BR',
    },
    {
      label: marker('LANGUAGE.SPANISH'),
      value: 'es',
    },
    {
      label: marker('LANGUAGE.ENGLISH'),
      value: 'us',
    },
  ],
};

export const MISSION_MODEL_DEFAULT_OPTION: KpFilterOption = {
  filterKey: 'mission_model__in',
  label: marker('GENERAL.MISSION_MODEL'),
  type: 'selectMultiple',
  options: [
    {
      label: marker('MISSION.MODEL.INTERNAL'),
      value: 'INTERNAL',
    },
    {
      label: marker('MISSION.MODEL.EXTERNAL'),
      value: 'EXTERNAL',
    },
    {
      label: marker('MISSION.MODEL.SCORM'),
      value: 'SCORM',
    },
    {
      label: marker('MISSION.MODEL.LIVE'),
      value: 'LIVE',
    },
    {
      label: marker('MISSION.MODEL.PRESENTIAL'),
      value: 'PRESENTIAL',
    },
  ],
};

export const MISSION_PROVIDER_DEFAULT_OPTION: KpFilterOption = {
  filterKey: 'mission_provider__id__in',
  type: 'autoComplete',
  customTemplate: 'providersAc',
  label: marker('GENERAL.MISSION_PROVIDER'),
};

export function SIMPLE_SELECTION_OPTION(
  filterKey: string,
  label: string,
  type: KpFilterOptionType = 'select',
): KpFilterOption {
  return {
    filterKey,
    label,
    type,
    options: [
      { label: marker('GENERAL.YES'), value: true },
      { label: marker('GENERAL.NO'), value: false },
    ],
  };
}

export function DIRECTORATE_OPTION(filterKey = 'director__in'): KpFilterOption {
  return {
    filterKey,
    type: 'autoComplete',
    customTemplate: 'directorsAc',
    label: marker('GENERAL.DIRECTORATE'),
  };
}

export function SUBDIRECTORATE_OPTION(filterKey = 'manager__in'): KpFilterOption {
  return {
    filterKey,
    type: 'autoComplete',
    customTemplate: 'managersAc',
    label: marker('GENERAL.SUBDIRECTORATE'),
  };
}

export function AREA_OF_ACTIVITY_OPTION(filterKey = 'area_of_activity__in'): KpFilterOption {
  return {
    filterKey,
    type: 'autoComplete',
    customTemplate: 'activityAreasAc',
    label: marker('GENERAL.ACTIVITY_AREA'),
  };
}
