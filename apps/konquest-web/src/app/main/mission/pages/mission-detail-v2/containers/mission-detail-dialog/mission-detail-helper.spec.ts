import { Mission, UserCreator } from '@app/main/mission/mission.model';
import { MissionDetailHelper } from './mission-detail-helper';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';

const missionMock: Mission = {
  id: '1',
  name: 'Sample Mission',
  duration_time: 60,
  points: 100,
  users_enrolled: 50,
  users_finished: '30',
  rating_avg: 4.5,
  rating_count: 20,
  ratings_total: 4,
  is_active: true,
  is_owner: true,
  is_contributor: false,
  created_date: '2023-10-16T10:00:00Z',
  minimum_performance: 0.8,
  mission_type: { name: 'Open For Workspace' },
  user_creator: { name: 'Test User' },
};

describe('MissionDetailHelper', () => {
  const durationPipe = new KpDurationPipe();
  const performancePipe = new KpPerformancePipe();

  describe('buildResume', () => {
    const cases: any[] = [
      [
        missionMock,
        true,
        [
          {
            label: 'GENERAL.DURATION',
            value: durationPipe.transform(missionMock.duration_time),
            icon: 'timer',
          },
          {
            label: 'MISSION.MISSION_MIN_PERFORMANCE',
            value: performancePipe.transform(missionMock.minimum_performance, '%'),
            icon: 'gps_fixed',
          },
          {
            label: 'GENERAL.SCORE',
            value: missionMock.points,
            icon: 'trophy',
          },
          {
            label: 'GENERAL.ENROLLMENTS',
            value: missionMock.users_enrolled,
            icon: 'person',
          },
          {
            label: 'GENERAL.FINISHED',
            value: missionMock.users_finished,
            icon: 'school',
          },
        ],
        false,
      ],
      [
        missionMock,
        false,
        [
          {
            label: 'GENERAL.DURATION',
            value: durationPipe.transform(missionMock.duration_time),
            icon: 'timer',
          },
          {
            label: 'MISSION.MISSION_MIN_PERFORMANCE',
            value: performancePipe.transform(missionMock.minimum_performance, '%'),
            icon: 'gps_fixed',
          },
          {
            label: 'GENERAL.ENROLLMENTS',
            value: missionMock.users_enrolled,
            icon: 'person',
          },
          {
            label: 'GENERAL.FINISHED',
            value: missionMock.users_finished,
            icon: 'school',
          },
        ],
        false,
      ],
      [
        missionMock,
        true,
        [
          {
            label: 'GENERAL.DURATION',
            value: durationPipe.transform(missionMock.duration_time),
            icon: 'timer',
          },
          {
            label: 'MISSION.MISSION_MIN_PERFORMANCE',
            value: performancePipe.transform(missionMock.minimum_performance, '%'),
            icon: 'gps_fixed',
          },
          {
            label: 'GENERAL.SCORE',
            value: missionMock.points,
            icon: 'trophy',
          },
        ],
        true,
      ],
      [
        missionMock,
        false,
        [
          {
            label: 'GENERAL.DURATION',
            value: durationPipe.transform(missionMock.duration_time),
            icon: 'timer',
          },
          {
            label: 'MISSION.MISSION_MIN_PERFORMANCE',
            value: performancePipe.transform(missionMock.minimum_performance, '%'),
            icon: 'gps_fixed',
          },
        ],
        true,
      ],
      [null, false, [], undefined],
    ];

    test.each(cases)(
      'for mission " %p " and isGamificationActive value " %p " should return this: " %p "',
      (mission, isGamificationActive, expectedValue, isMobile) => {
        expect(MissionDetailHelper.buildResume(mission, isMobile, isGamificationActive)).toEqual(expectedValue);
      },
    );
  });

  it('should build title', () => {
    const title = MissionDetailHelper.buildTitle(missionMock);
    const result = {
      title: missionMock.name,
      open: true,
      createdDate: missionMock.created_date,
      creatorName: (missionMock.user_creator as UserCreator).name,
      rating: missionMock.rating_avg,
      ratings: missionMock.rating_count,
      ratings_total: missionMock.ratings_total,
    };
    expect(title).toEqual(result);
  });

  it('should build title without mission', () => {
    const title = MissionDetailHelper.buildTitle(null);
    expect(title).toEqual(undefined);
  });
});
