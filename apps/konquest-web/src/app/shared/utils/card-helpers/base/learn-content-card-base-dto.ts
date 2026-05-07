import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { LearnContentCardActionId, LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';

export abstract class LearnContentCardBaseDto<T> {
  private readonly actions: LearnContentCardActionId[];
  private readonly tags: LearnContentCardTag[];
  private readonly _data: LearnContentCardData;

  protected constructor(
    data: T,
    protected isBanner?: boolean,
    protected isSuperAdmin?: boolean,
    protected isAdmin?: boolean,
  ) {
    this._data = this.buildData(data, isBanner);
    this.actions = this.setActions(data);
    this.tags = this.buildTags(data);
  }

  abstract buildData(data: T, isBanner?: boolean): LearnContentCardData;

  abstract setActions(data: T): LearnContentCardActionId[];

  abstract buildTags(data: T): LearnContentCardTag[];

  getData(): LearnContentCardData {
    const actions: LearnContentCardActionId[] = this.actions?.length ? this.actions : [];
    return { ...this._data, actions, tags: this.tags };
  }
}
