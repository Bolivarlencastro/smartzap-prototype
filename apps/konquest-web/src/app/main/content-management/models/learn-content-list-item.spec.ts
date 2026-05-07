import { CoursesResponse, TrailsResponse } from '@core/model/search-api';
import { Chance } from 'chance';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { MissionModel } from 'app/main/mission/mission.model';

describe('LearnContentListItem', () => {
  const chance = new Chance();

  describe('fromCourseItem', () => {
    it('should create a LearnContentListItem instance from a course from search', () => {
      const course: CoursesResponse = {
        id: chance.guid(),
        name: chance.name(),
        course_category: { name: chance.name(), id: chance.guid() },
        user_creator: { name: chance.name(), id: chance.guid() },
        duration_time: chance.integer(),
        course_model: MissionModel.INTERNAL,
        development_status: DevelopmentStatus.DONE,
        created_date: '2021-01-01T00:00:00.000Z',
        stats: { user_is_owner: true, enrollments_count: 10, workspace_minimum_performance: 0.5 },
        course_type: { name: 'Open For Workspace' },
      } as CoursesResponse;

      const expectedItem: LearnContentListItem = {
        id: course.id,
        name: course.name,
        creatorName: course.user_creator.name,
        creationDate: course.created_date,
        isCreator: true,
        icon: 'rocket_launch',
        meta: {
          status: course.development_status,
          category: course.course_category?.name,
          open: true,
          enrolledCount: 10,
          externalCourse: false,
          isIntegration: false,
          shared: false,
          duration: course.duration_time,
          minimumPerformance: 0.5,
        },
      };

      expect(LearnContentListItem.fromCourseItem(course)).toEqual(expectedItem);
    });
  });

  describe('fromEventItem', () => {
    it('should create a LearnContentListItem instance from a event from search', () => {
      const course: CoursesResponse = {
        id: chance.guid(),
        name: chance.name(),
        course_category: { name: chance.name(), id: chance.guid() },
        user_creator: { name: chance.name(), id: chance.guid() },
        duration_time: chance.integer(),
        course_model: MissionModel.LIVE,
        development_status: DevelopmentStatus.DONE,
        created_date: '2021-01-01T00:00:00.000Z',
        event_date: '2021-01-01T00:00:00.000Z',
        course_type: { name: 'Open For Workspace' },
        stats: { user_is_owner: true, enrollments_count: 10, workspace_minimum_performance: 0.5 },
      } as CoursesResponse;

      const expectedItem: LearnContentListItem = {
        id: course.id,
        name: course.name,
        creatorName: course.user_creator.name,
        creationDate: course.created_date,
        isCreator: true,
        icon: 'videocam',
        meta: {
          status: course.development_status,
          enrolledCount: 10,
          duration: course.duration_time,
          eventType: MissionModel.LIVE,
          eventDate: course.event_date,
        },
      };

      expect(LearnContentListItem.fromEventItem(course)).toEqual(expectedItem);
    });
  });

  describe('fromTrailItem', () => {
    it('should create a LearnContentListItem instance from a trail', () => {
      const trail: TrailsResponse = {
        id: chance.guid(),
        name: chance.name(),
        duration_time: chance.integer(),
        created_date: '2021-01-01T00:00:00.000Z',
        user_creator: { id: chance.guid(), name: chance.name() },
        trail_type: { name: 'Open For Workspace' },
        is_active: true,
        stats: { user_is_owner: true, total_courses: 10, total_pulses: 10, enrollment: 10 },
      } as TrailsResponse;

      const expectedItem: LearnContentListItem = {
        id: trail.id,
        name: trail.name,
        creatorName: trail.user_creator.name,
        isCreator: true,
        creationDate: trail.created_date,
        icon: 'conversion_path',
        meta: {
          open: true,
          enrolledCount: 10,
          duration: trail.duration_time,
          coursesCount: 10,
          pulsesCount: 10,
          isActive: true,
        },
      };

      expect(LearnContentListItem.fromTrailItem(trail)).toEqual(expectedItem);
    });
  });
});
