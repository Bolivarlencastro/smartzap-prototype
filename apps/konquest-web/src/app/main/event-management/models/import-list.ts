import {
  ImportCheckModel,
  ImportMenuItem,
  MissionInformationDate,
  UsersImported,
} from '@app/main/mission/mission.model';

export type ImportListViewMode = 'select' | 'import-error' | 'import-success' | 'import-confirmation';

export interface ImportListDialogData {
  eventId: string;
  dates: MissionInformationDate[];
}

export interface ImportListViewModel {
  viewMode: ImportListViewMode;
  loading: boolean;
  importData: ImportCheckModel;
  importDataSource: UsersImported[];
  dates: MissionInformationDate[];
}

export const IMPORT_SOURCE_ITEMS: ImportMenuItem[] = [
  {
    name: 'Microsoft Teams',
    icon: 'teams',
  },
  {
    name: 'Google Meet',
    icon: 'meet',
    disabled: true,
  },
  {
    name: 'Zoom',
    icon: 'zoom',
    disabled: true,
  },
];
