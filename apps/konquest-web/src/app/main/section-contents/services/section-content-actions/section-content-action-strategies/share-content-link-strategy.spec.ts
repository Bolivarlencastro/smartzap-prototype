import { ShareContentLinkStrategy } from './share-content-link-strategy';
import { Chance } from 'chance';
import { KeepsPathLocationStrategy } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Clipboard } from '@angular/cdk/clipboard';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { environment } from 'environments/environment';
import { MISSIONS_DETAIL_PREFIX, TRAILS_DETAIL_PREFIX } from 'app/shared/services';

describe('ShareContentLinkStrategy', () => {
  let strategy: ShareContentLinkStrategy;
  const mockHash = 'mock-hash';
  const locationMock: jest.Mocked<KeepsPathLocationStrategy> = {
    getHashFromUrl: jest.fn().mockReturnValue(mockHash),
  } as unknown as jest.Mocked<KeepsPathLocationStrategy>;
  let clipboardMock: jest.Mocked<Clipboard>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  const chance = new Chance();

  beforeEach(() => {
    clipboardMock = { copy: jest.fn() } as unknown as jest.Mocked<Clipboard>;
    messageServiceMock = { success: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    strategy = new ShareContentLinkStrategy(locationMock, clipboardMock, messageServiceMock);
  });

  it('should share content of type course', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;

    const action = strategy.execute(SECTION_CONTENT_TYPE.COURSES, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(clipboardMock.copy).toHaveBeenCalledWith(
        `${environment.apps.konquest.url}${mockHash}${MISSIONS_DETAIL_PREFIX}/${item.contentId}`,
      );
      expect(messageServiceMock.success).toHaveBeenCalledWith('GENERAL.COPIED_TO_CLIPBOARD');
      done();
    });
  });

  it('should share content of type trail', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;

    const action = strategy.execute(SECTION_CONTENT_TYPE.TRAILS, item);

    action.subscribe((result) => {
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(clipboardMock.copy).toHaveBeenCalledWith(
        `${environment.apps.konquest.url}${mockHash}${TRAILS_DETAIL_PREFIX}/${item.contentId}`,
      );
      expect(messageServiceMock.success).toHaveBeenCalledWith('GENERAL.COPIED_TO_CLIPBOARD');
      done();
    });
  });
});
