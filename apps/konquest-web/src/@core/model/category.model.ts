import { Channel } from 'app/main/channel/channel.model';

export class Category {
  constructor(
    public name: string,
    public image: string,
    public id: string,
    public description?: string,
  ) {}
}

export class CategoryCustom {
  constructor(
    public name: string,
    public image: string,
    public description?: string,
  ) {}
}

export class ChannelRelations {
  constructor(
    public owner?: Channel[],
    public subscriptions?: Channel[],
    public contributor?: Channel[],
  ) {}
}
