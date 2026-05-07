import { Pulse } from '@core/model/pulse.model';
import { Channel } from 'app/main/channel/channel.model';
import { UserCreator } from './user.model';

export class Comment {
  constructor(
    public id?: string,
    public comment?: string,
    public relation?: Pulse | Channel,
    public user?: UserCreator,
    public created_date?: string,
  ) {}
}
