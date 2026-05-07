import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { Chance } from 'chance';
import { of } from 'rxjs';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { PublishContentStrategy } from './publish-content-strategy';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('PublishContentStrategy', () => {
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let strategy: PublishContentStrategy;
  const chance = new Chance();

  beforeEach(() => {
    missionServiceMock = {
      changeMissionStatus: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<MissionServiceV2>;

    messageServiceMock = {
      success: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    strategy = new PublishContentStrategy(missionServiceMock, messageServiceMock);
  });

  it('should return the ContentManagementListActions.updateItemActionResult action after publishing content', (done) => {
    const item = {
      id: chance.guid(),
      meta: {
        status: DevelopmentStatus.IN_REVIEW,
        category: 'Test Course',
        duration: 60,
      },
    } as unknown as LearnContentListItem;

    const action = strategy.execute('courses', item) as any;

    action.subscribe((result: any) => {
      expect(missionServiceMock.changeMissionStatus).toHaveBeenCalledWith(item.id, DevelopmentStatus.DONE);
      expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.DETAILS.PUBLISHED_SUCCESSFULLY');
      expect(result).toEqual(
        ContentManagementListActions.updateItemActionResult({
          update: {
            id: item.id,
            changes: {
              meta: {
                ...item.meta,
                status: DevelopmentStatus.DONE,
              },
            },
          },
        }),
      );
      done();
    });
  });
});
