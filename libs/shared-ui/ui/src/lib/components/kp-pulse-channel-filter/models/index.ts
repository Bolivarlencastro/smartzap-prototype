import { FormControl } from '@angular/forms';

export interface PulseChannelModel<S, B> {
  categories: S;
  contentTypes: S;
  favorites: B;
  subscribedChannels: B;
  languages: S;
}

export type PulseChannelFilter = Partial<PulseChannelModel<string[], boolean>>;
export type PulseChannelForm = Partial<PulseChannelModel<FormControl<string[]>, FormControl<boolean>>>;
