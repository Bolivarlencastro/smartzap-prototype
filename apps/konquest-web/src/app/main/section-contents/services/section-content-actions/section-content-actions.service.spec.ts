import { SectionContentActionsService } from './section-content-actions.service';
import { Injector } from '@angular/core';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { Chance } from 'chance';
import { SectionContentActionStrategy } from './section-content-action-strategies/section-content-action.strategy';
import { EMPTY, of } from 'rxjs';
import { DefaultContentActionStrategy } from './section-content-action-strategies/default-content-action-strategy';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { SectionContentItemEvent } from 'app/main/section-contents/models/section-content-item-event';

describe('SectionContentActionsService', () => {
  let service: SectionContentActionsService;
  let injectorMock: jest.Mocked<Injector>;
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  const chance = new Chance();

  beforeEach(() => {
    injectorMock = { get: jest.fn() } as unknown as jest.Mocked<Injector>;
    service = new SectionContentActionsService(injectorMock);
    jest.clearAllMocks();
  });

  it(`should return a ${SectionContentItemActions.executeActionNoopResult.type} when the event is falsy`, (done) => {
    const action = service.executeAction(null);

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid event to handle.');
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should call execute on the correct action strategy', (done) => {
    const event = {
      action: 'start',
      contentType: SECTION_CONTENT_TYPE.COURSES,
      item: { contentId: chance.guid() },
    } as unknown as SectionContentItemEvent;

    const mockStrategy: SectionContentActionStrategy = {
      execute: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as SectionContentActionStrategy;
    injectorMock.get.mockReturnValueOnce(mockStrategy);

    const result = service.executeAction(event);

    result.subscribe(() => {
      expect(injectorMock.get).toHaveBeenCalledWith(event.action, expect.any(DefaultContentActionStrategy));
      expect(mockStrategy.execute).toHaveBeenCalledWith(event.contentType, event.item);
      done();
    });
  });

  it('should use the default strategy if no specific strategy is found', (done) => {
    const itemEvent = {
      action: 'non-existent-action',
      contentType: SECTION_CONTENT_TYPE.COURSES,
      item: { contentId: chance.guid() },
    } as unknown as SectionContentItemEvent;

    injectorMock.get.mockImplementation((_token, defaultValue) => defaultValue);

    const result = service.executeAction(itemEvent);

    result.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `No content action found for action ${itemEvent.action}. ContentType: ${itemEvent.contentType}, Item: ${itemEvent.item}`,
      );
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });
});
