import { FixtureContent } from './content-options';
import { PulseOptions } from './pulse-options';

export interface ChannelOptions {
  type?: any;
  id?: string;
  name?: string;
  channel_type?: string;
  channel_category?: string;
  description?: string;
  is_active?: boolean;
  language?: string;
  channel_id?: string;
  pulse_id?: string;
  typeUUID?: string;
  categorieUUID?: string;
  active?: boolean;
  languageID?: string;
  categorie?: string;
  file?: string;
  thumbnail?: string;
}

export interface ChannelPulseContentOptions {
  channel?: ChannelOptions;
  pulse?: PulseOptions;
  content?: FixtureContent;
}
