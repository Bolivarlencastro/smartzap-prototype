import { Channel } from 'app/main/channel/channel.model';
import { Mission } from 'app/main/mission/mission.model';
import { User } from '.';

export interface Contributor {
  id: string;
  user: User;
  created_date: string;
  updated_date: string;
  channel?: Channel;
  mission?: Mission;
}
