import { Chance } from 'chance';
import { EnrollToCourseContentStrategy } from './enroll-to-course-content-strategy';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SECTION_CONTENT_TYPE } from '../../../models/section-contents-type';
import { of, throwError } from 'rxjs';
import { SectionContentItemActions } from '../../../store/actions';
import { SectionContentItemEvent } from '../../../models/section-content-item-event';

describe('EnrollToCourseContentStrategy', () => {
  let strategy: EnrollToCourseContentStrategy;
  const chance = new Chance();
  let authServiceMock: jest.Mocked<AuthService>;
  let missionServiceMock: jest.Mocked<MissionServiceV2>;

  const userId = chance.guid();

  beforeEach(() => {
    authServiceMock = {
      userId,
    } as jest.Mocked<AuthService>;

    missionServiceMock = {
      enroll: jest.fn(),
    } as unknown as jest.Mocked<MissionServiceV2>;

    strategy = new EnrollToCourseContentStrategy(authServiceMock, missionServiceMock);
  });

  it('should warn and do nothing if content type is not COURSES', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const contentType = SECTION_CONTENT_TYPE.EVENTS;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    strategy.execute(contentType, item).subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(`It is not possible to enroll to ${contentType} content.`);
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(missionServiceMock.enroll).not.toHaveBeenCalled();
      done();
    });
  });

  it('should enroll user and dispatch executeAction on success', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const contentType = SECTION_CONTENT_TYPE.COURSES;
    const event: SectionContentItemEvent = { item, contentType, action: 'start' };

    missionServiceMock.enroll.mockReturnValue(of({}));

    strategy.execute(contentType, item).subscribe((result) => {
      expect(missionServiceMock.enroll).toHaveBeenCalledWith(item.contentId, userId);
      expect(result).toEqual(SectionContentItemActions.executeAction({ event }));
      done();
    });
  });

  it('should dispatch an error action on enrollment failure', (done) => {
    const item = { contentId: chance.guid() } as LearnContentCardData;
    const contentType = SECTION_CONTENT_TYPE.COURSES;
    const error = new Error('Enrollment failed');

    missionServiceMock.enroll.mockReturnValue(throwError(() => error));

    strategy.execute(contentType, item).subscribe((result) => {
      expect(missionServiceMock.enroll).toHaveBeenCalledWith(item.contentId, userId);
      expect(result).toEqual(SectionContentItemActions.executeActionErrorResult({ error }));
      done();
    });
  });
});
