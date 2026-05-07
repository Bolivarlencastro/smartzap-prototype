export interface ModalFilterItem {
  id?: string;
  name?: string;
  checked: boolean;
}

export interface MenuFilterItem extends ModalFilterItem {
  image?: string;
}

export enum QuickFilterType {
  HOME = 'HOME',
  BOOKMARK = 'BOOKMARK',
  ENROLLMENT = 'ENROLLMENT',
  MINE = 'MINE',
  MY_LIST = 'MY_LIST',
  PULSES = 'PULSES',
  LEARNING_TRAILS = 'LEARNING_TRAILS',
}

export interface FilterActions {
  name: string;
  type: QuickFilterType;
  icon?: string;
  svgIcon?: string;
}

export interface FilterOption {
  title: string;
  emptyMessage: string;
}

export interface KpFilterParams {
  favorites: boolean;
  languages: string[];
  missionModels: string[];
  subscribedChannels: boolean;
  categories: string[];
  providers: string[];
  contentTypes: string[];
  range?: KpFilterRange;
}

export interface KpFilterRange {
  from: string;
  to: string;
}
