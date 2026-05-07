import { ContentManagementActionsService } from './content-management-actions.service';
import { Injector } from '@angular/core';
import { ContentManagementListActions } from '../../store/actions';
import { Chance } from 'chance';
import { ManagementActionStrategy } from 'app/main/content-management/services/content-management-actions/management-action-strategy/management-action.strategy';
import { EMPTY, of } from 'rxjs';
import { LearnContentListItemEvent } from '../../models/learn-content-list-item-event';

describe('ContentManagementActionsService', () => {
  let service: ContentManagementActionsService;
  let injectorMock: jest.Mocked<Injector>;
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  const chance = new Chance();

  beforeEach(() => {
    injectorMock = { get: jest.fn() } as unknown as jest.Mocked<Injector>;
    service = new ContentManagementActionsService(injectorMock);
  });

  it('should return an observable of ContentManagementListActions.executeActionNoopResult when there is no action to handle', (done) => {
    const action = service.executeAction(null);

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid event to handle');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());

      done();
    });
  });

  it('should call execute in the action provider', (done) => {
    const action = {
      action: 'EDIT',
      contentType: 'courses',
      item: { id: chance.guid() },
      remainingSeats: 3,
    } as unknown as LearnContentListItemEvent;

    const mockStrategy: ManagementActionStrategy = {
      execute: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as ManagementActionStrategy;
    injectorMock.get.mockReturnValueOnce(mockStrategy);

    const result = service.executeAction(action);

    result.subscribe(() => {
      expect(mockStrategy.execute).toHaveBeenCalledWith(action.contentType, action.item, action.remainingSeats);
      done();
    });
  });

  it('should return the ContentManagementListActions.executeActionNoopResult and log the warning when there is no handler for the action', (done) => {
    const action = {
      action: 'INVALID_ACTION',
      contentType: 'courses',
      item: { id: chance.guid() },
    } as unknown as LearnContentListItemEvent;
    injectorMock.get.mockImplementation((_token, defaultValue) => defaultValue);

    const result = service.executeAction(action);

    result.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `No management action found for action ${action.action}. ContentType: ${action.contentType}, Item: ${action.item}`,
      );
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });
});
