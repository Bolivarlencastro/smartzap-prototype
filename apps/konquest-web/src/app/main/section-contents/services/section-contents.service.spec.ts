import { CourseSectionResponse } from '@core/model/search-api/course-section-response.model';
import { TrailSectionResponse } from '@core/model/search-api/trail-section-response.model';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionModel } from 'app/main/mission/mission.model';
import { Chance } from 'chance';
import { SectionContentsService } from './section-contents.service';

describe('SectionContentsService', () => {
  const chance = new Chance();

  describe('mapCoursesToLearnContentCardData', () => {
    it('should map global search course items to LearnContentCardData', () => {
      const mockCourse: CourseSectionResponse = {
        id: chance.guid(),
        title: chance.name(),
        vertical_holder_image: chance.url(),
        thumb_image: null,
        duration: chance.integer(),
        external_url: chance.url(),
        external_course: {
          provider_name: chance.name(),
          course_type: null,
          course_url: null,
          id: null,
          provider_description: null,
          provider_icon: null,
          provider_id: null,
        },
        language: 'pt-br',
        course_model: MissionModel.INTERNAL,
        development_status: DevelopmentStatus.DONE,
        stats: {
          enrollment: {
            enrollment_id: chance.guid(),
            progress: chance.floating({ min: 0, max: 1 }),
            status: EnrollmentStatuses.ENROLLED,
            goal_date: chance.date().toString(),
            required: true,
          },
          favorite: chance.guid(),
          is_integration: false,
          is_owner: true,
          is_contributor: false,
          is_instructor: false,
        },
        event_date: chance.date().toString(),
      };
      const courses: CourseSectionResponse[] = [mockCourse];

      const result = SectionContentsService.mapCoursesToLearnContentCardData(courses);

      expect(result).toEqual([
        {
          contentId: mockCourse.id,
          title: mockCourse.title,
          backgroundImage: mockCourse.vertical_holder_image,
          duration: mockCourse.duration,
          developmentStatus: mockCourse.development_status,
          externalProvider: mockCourse.external_course.provider_name,
          externalCourseUrl: mockCourse.external_url,
          language: mockCourse.language,
          missionModel: mockCourse.course_model,
          enrollmentId: mockCourse.stats.enrollment.enrollment_id,
          progress: mockCourse.stats.enrollment.progress * 100,
          eventDate: mockCourse.event_date,
          bookmarkId: mockCourse.stats.favorite,
          isIntegration: mockCourse.stats.is_integration,
          isOwner: mockCourse.stats.is_owner,
          isContributor: mockCourse.stats.is_contributor,
          enrollment: {
            goal_date: mockCourse.stats.enrollment.goal_date,
            required: true,
            status: EnrollmentStatuses.ENROLLED,
          },
        },
      ]);
    });
  });

  describe('mapTrailToLearnContentCardData', () => {
    it('should map a trail object to LearnContentCardData format', () => {
      const mockTrail: TrailSectionResponse = {
        id: chance.guid(),
        title: chance.sentence({ words: 3 }),
        thumb_image: chance.url(),
        is_active: true,
        duration: chance.integer({ min: 10, max: 100 }),
        language: 'en',
        stats: {
          enrollment: {
            enrollment_id: chance.guid(),
            progress: chance.floating({ min: 0, max: 1 }),
            required: true,
            status: EnrollmentStatuses.ENROLLED,
            goal_date: chance.date().toString(),
          },
          missions_count: chance.integer({ min: 1, max: 10 }),
          pulse_count: chance.integer({ min: 1, max: 5 }),
          is_owner: false,
        },
      };
      const trails: TrailSectionResponse[] = [mockTrail];

      const result = SectionContentsService.mapTrailToLearnContentCardData(trails);

      expect(result).toEqual([
        {
          contentId: mockTrail.id,
          title: mockTrail.title,
          backgroundImage: mockTrail.thumb_image,
          duration: mockTrail.duration,
          language: mockTrail.language,
          enrollmentId: mockTrail.stats?.enrollment?.enrollment_id,
          progress: mockTrail.stats?.enrollment?.progress * 100,
          missionsCount: mockTrail.stats?.missions_count,
          pulsesCount: mockTrail.stats?.pulse_count,
          enrollment: {
            required: true,
            status: EnrollmentStatuses.ENROLLED,
            goal_date: mockTrail.stats?.enrollment?.goal_date,
          },
          isActive: mockTrail.is_active,
        },
      ]);
    });
  });
});
