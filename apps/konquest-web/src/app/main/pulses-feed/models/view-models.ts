import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';

import { ChannelPulseSideItem } from './channel';
import { Pulse } from './pulse';

export interface FeedListViewModel {
  selectedTab: 'feed' | 'channels';
  feedLayout: 'list' | 'grid';
}

export interface ChannelsListViewModel {
  channels: KpChannelCardModel[];
  loading: boolean;
  loadingMore: boolean;
}

export interface PulsesListViewModel {
  pulses: Pulse[];
  loading: boolean;
  loadingMore: boolean;
}

export interface SideFilterOption {
  id: string;
  name: string;
}

export interface SideFiltersViewModel {
  loading: boolean;
  selectedTab: 'feed' | 'channels';
  generalOptions: SideFilterOption[];
  languageOptions: SideFilterOption[];
  typeOptions: SideFilterOption[];
  categoryOptions: SideFilterOption[];
  selectedGeneral: string | null;
  selectedLanguages: string[];
  selectedTypes: string[];
  selectedCategories: string[];
}

export interface FavoritePulsesViewModel {
  loading: boolean;
  items: ChannelPulseSideItem[];
}

export interface ChannelsFilterViewModel {
  isCurator: boolean;
  createdByMe: ChannelsFilterSectionViewModel;
  subscribed: ChannelsFilterSectionViewModel;
  selectedChannelId: string | null;
  selectedTab: 'feed' | 'channels';
}

export interface ChannelsFilterSectionViewModel {
  loading: boolean;
  items: ChannelPulseSideItem[];
}
