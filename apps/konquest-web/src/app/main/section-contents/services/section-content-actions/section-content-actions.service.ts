import { Injectable, Injector } from '@angular/core';
import { SectionContentItemEvent } from 'app/main/section-contents/models/section-content-item-event';
import { of } from 'rxjs';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { DefaultContentActionStrategy } from './section-content-action-strategies/default-content-action-strategy';
import { SectionContentActionStrategy } from './section-content-action-strategies/section-content-action.strategy';

@Injectable()
export class SectionContentActionsService {
  constructor(private readonly injector: Injector) {}

  executeAction(event: SectionContentItemEvent) {
    if (!event) {
      console.warn('Invalid event to handle.');
      return of(SectionContentItemActions.executeActionNoopResult());
    }

    const { item, contentType, action } = event;
    const defaultActionStrategy = new DefaultContentActionStrategy(event.action);
    const strategy = this.injector.get<SectionContentActionStrategy>(action as any, defaultActionStrategy);
    return strategy.execute(contentType, item);
  }
}
