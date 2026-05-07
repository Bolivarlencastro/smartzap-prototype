/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */

import { Channel } from 'app/main/channel/channel.model';

export class Subscribe {
  constructor(
    public id?: string,
    public subscription_date?: string,
    public unsubscribe_date?: string,
    public active_subscription?: string,
    public user?: string,
    public channel?: Channel,
  ) {}
}
