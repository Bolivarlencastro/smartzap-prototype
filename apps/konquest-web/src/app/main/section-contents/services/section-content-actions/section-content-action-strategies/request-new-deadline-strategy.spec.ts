import { Chance } from 'chance';
import { RequestNewDeadlineStrategy } from './request-new-deadline-strategy';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { EMPTY, of, throwError } from 'rxjs';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';

describe('RequestNewDeadlineStrategy', () => {
  let strategy: RequestNewDeadlineStrategy;
  const chance = new Chance();
  let courseEnrollmentsApiMock: jest.Mocked<MissionEnrollmentsAPI>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    courseEnrollmentsApiMock = {
      requestExtendDeadline: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<MissionEnrollmentsAPI>;

    messageServiceMock = {
      success: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    strategy = new RequestNewDeadlineStrategy(courseEnrollmentsApiMock, messageServiceMock);
  });

  it('should warn and return no-op action if content type is EVENTS', (done) => {
    const item = {} as LearnContentCardData;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const contentType = SECTION_CONTENT_TYPE.EVENTS;

    strategy.execute(contentType, item).subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(`It is not possible to request a new deadline for ${contentType}.`);
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      expect(courseEnrollmentsApiMock.requestExtendDeadline).not.toHaveBeenCalled();
      done();
    });
  });

  it('should request a new deadline for a course', (done) => {
    const item = { enrollmentId: chance.guid() } as LearnContentCardData;
    const contentType = SECTION_CONTENT_TYPE.COURSES;

    strategy.execute(contentType, item).subscribe((result) => {
      expect(courseEnrollmentsApiMock.requestExtendDeadline).toHaveBeenCalledWith(item.enrollmentId);
      expect(messageServiceMock.success).toHaveBeenCalledWith('ENROLLMENTS.REQUEST_EXTEND_SUCCESS');
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should request a new deadline for a trail', (done) => {
    const item = { enrollmentId: chance.guid() } as LearnContentCardData;
    const contentType = SECTION_CONTENT_TYPE.TRAILS;

    strategy.execute(contentType, item).subscribe((result) => {
      expect(courseEnrollmentsApiMock.requestExtendDeadline).toHaveBeenCalledWith(item.enrollmentId);
      expect(messageServiceMock.success).toHaveBeenCalledWith('ENROLLMENTS.REQUEST_EXTEND_SUCCESS');
      expect(result).toEqual(SectionContentItemActions.executeActionNoopResult());
      done();
    });
  });

  it('should propagate the error on a failed API call', (done) => {
    const item = { enrollmentId: chance.guid() } as LearnContentCardData;
    const contentType = SECTION_CONTENT_TYPE.COURSES;
    const error = new Error('API Error');
    courseEnrollmentsApiMock.requestExtendDeadline.mockReturnValue(throwError(() => error));

    strategy.execute(contentType, item).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(courseEnrollmentsApiMock.requestExtendDeadline).toHaveBeenCalledWith(item.enrollmentId);
        expect(messageServiceMock.success).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
