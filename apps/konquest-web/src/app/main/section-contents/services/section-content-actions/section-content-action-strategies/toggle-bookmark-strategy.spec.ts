import { Chance } from 'chance';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SECTION_CONTENT_TYPE } from '../../../models/section-contents-type';
import { SectionContentItemActions } from '../../../store/actions';
import { ToggleBookmarkStrategy } from './toggle-bookmark-strategy';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { EMPTY, of } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('ToggleBookmarkStrategy', () => {
  let strategy: ToggleBookmarkStrategy;
  const chance = new Chance();
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    missionServiceMock = {
      bookmark: jest.fn().mockReturnValue(of(EMPTY)),
      removeBookmark: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<MissionServiceV2>;
    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    strategy = new ToggleBookmarkStrategy(missionServiceMock, messageServiceMock);
  });

  it('should bookmark a learn content', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const mockBookmarkId = chance.guid();
    missionServiceMock.bookmark.mockReturnValueOnce(of({ id: mockBookmarkId }));

    const action = strategy.execute(SECTION_CONTENT_TYPE.COURSES, item);

    action.subscribe((result) => {
      expect(result).toEqual(
        SectionContentItemActions.updateItemActionResult({
          update: {
            id: item.contentId,
            changes: { bookmarkId: mockBookmarkId },
          },
        }),
      );
      expect(missionServiceMock.bookmark).toHaveBeenCalledWith(item.contentId);
      expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.BOOKMARK_ADDED');
      done();
    });
  });

  it('should unbookmark a learn content', (done) => {
    const mockBookmarkId = chance.guid();
    const item = { contentId: chance.guid(), bookmarkId: mockBookmarkId } as LearnContentCardData;

    const action = strategy.execute(SECTION_CONTENT_TYPE.COURSES, item);

    action.subscribe((result) => {
      expect(result).toEqual(
        SectionContentItemActions.updateItemActionResult({
          update: {
            id: item.contentId,
            changes: { bookmarkId: undefined },
          },
        }),
      );
      expect(missionServiceMock.removeBookmark).toHaveBeenCalledWith(item.bookmarkId);
      expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.BOOKMARK_REMOVED');
      done();
    });
  });

  it('should return the noop action when the content can not be bookmarked', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute(SECTION_CONTENT_TYPE.TRAILS, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to toggle bookmark for TRAILS.');
      expect(missionServiceMock.bookmark).not.toHaveBeenCalled();
      done();
    });
  });
});
