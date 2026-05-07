import { ScormService } from './scorm.service';
import {
  CMI,
  Pagination,
  ScormActivitiesApi,
  ScormParams,
  ScormResult,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Chance } from 'chance';
import { EMPTY, of } from 'rxjs';

const chance = new Chance();
const userId = chance.guid();
const userName = 'Jane Doe';
const compositeName = 'Jane, Doe';

const defaultCMI: CMI = {
  suspend_data: '',
  launch_data: '',
  comments: '',
  comments_from_lms: '',
  core: {
    student_id: userId,
    student_name: compositeName,
    lesson_location: '',
    credit: '',
    lesson_status: '',
    entry: '',
    lesson_mode: '',
    exit: '',
    session_time: '',
    score: {
      raw: '',
      min: '',
      max: '',
    },
  },
  objectives: {},
  student_data: {
    mastery_score: '',
    max_time_allowed: '',
    time_limit_action: '',
  },
  student_preference: {
    audio: '',
    language: '',
    speed: '',
    text: '',
  },
  interactions: {},
};

describe('ScormService', () => {
  let service: ScormService;
  let userProfileServiceStub: jest.Mocked<UserProfileService>;
  let scormApiMock: jest.Mocked<ScormActivitiesApi>;

  beforeEach(() => {
    userProfileServiceStub = {
      getProfile: jest.fn().mockReturnValue({
        id: userId,
        name: userName,
      }),
    } as unknown as jest.Mocked<UserProfileService>;
    scormApiMock = {
      fetchScormActivity: jest.fn().mockReturnValue(of(EMPTY)),
      createScormActivity: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<ScormActivitiesApi>;

    service = new ScormService(scormApiMock, userProfileServiceStub);
  });

  describe('fetch', () => {
    it('should return the scorm activity from localStorage if the user is the mission owner', (done) => {
      const params: ScormParams = {
        viewingAsUser: true,
        missionStageContentId: 'mock_content_id',
        enrollmentId: 'mock_enrolment_id',
      };

      service.fetch(params).subscribe((result) => {
        expect(result).toMatchObject(defaultCMI);
        done();
      });
    });

    it('should return the scorm activity for a normal user', (done) => {
      const contentId = chance.guid();
      const enrollmentId = chance.guid();
      const params: ScormParams = {
        viewingAsUser: false,
        missionStageContentId: contentId,
        enrollmentId: enrollmentId,
      };
      scormApiMock.fetchScormActivity.mockReturnValueOnce(
        of({
          count: 1,
          results: [{ cmi: defaultCMI }],
        } as Pagination<ScormResult>),
      );

      service.fetch(params).subscribe((result) => {
        expect(scormApiMock.fetchScormActivity).toHaveBeenCalledWith(userId, contentId, enrollmentId);
        expect(result).toMatchObject(defaultCMI);
        done();
      });
    });

    it('should return the default scorm activity when there are no results', (done) => {
      const contentId = chance.guid();
      const enrollmentId = chance.guid();
      const params: ScormParams = {
        viewingAsUser: false,
        missionStageContentId: contentId,
        enrollmentId: enrollmentId,
      };
      scormApiMock.fetchScormActivity.mockReturnValueOnce(
        of({
          count: 0,
          results: [],
        } as Pagination<ScormResult>),
      );

      service.fetch(params).subscribe((result) => {
        expect(result).toMatchObject(defaultCMI);
        done();
      });
    });
  });
  describe('save', () => {
    it('should save the Scorm CMI locally if the user is the mission owner and return the provided CMI', (done) => {
      const contentId = chance.guid();
      const enrollmentId = chance.guid();
      const params: ScormParams = {
        viewingAsUser: true,
        missionStageContentId: contentId,
        enrollmentId: enrollmentId,
      };
      global.Storage.prototype.setItem = jest.fn().mockImplementation(() => {});
      const setSpy = jest.spyOn(localStorage, 'setItem');

      service.save(params, defaultCMI).subscribe((result) => {
        expect(setSpy).toHaveBeenCalledWith(ScormService.STORAGE_ID_KEY, contentId);
        expect(setSpy).toHaveBeenCalledWith(ScormService.STORAGE_CMI_KEY, JSON.stringify(defaultCMI));
        expect(result).toBe(defaultCMI);
        done();
      });
    });

    it('should save the Scorm CMI', (done) => {
      const contentId = chance.guid();
      const enrollmentId = chance.guid();
      const params: ScormParams = {
        viewingAsUser: false,
        missionStageContentId: contentId,
        enrollmentId: enrollmentId,
      };
      scormApiMock.createScormActivity.mockReturnValueOnce(of(defaultCMI));

      service.save(params, defaultCMI).subscribe((result) => {
        expect(scormApiMock.createScormActivity).toHaveBeenCalledWith(userId, contentId, enrollmentId, defaultCMI);
        expect(result).toBe(defaultCMI);
        done();
      });
    });
  });
});
