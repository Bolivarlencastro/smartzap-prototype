import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { TrailDetailHelper } from './trail-detail-helper';

const trailMock = {
  id: '1',
  name: 'Learning Trail 1',
  description: 'Learning Trail Description',
  holder_image: 'path/to/holder_image.png',
  thumb_image: 'path/to/thumb_image.png',
  duration_time: 60,
  points: '100',
  is_active: true,
  language: 'pt-br',
  expiration_date: '2023-12-31',
  created_date: '2023-01-01',
  updated_date: '2023-10-18',
  learning_trail_type: {
    created_date: '',
    description: '',
    id: '',
    image: '',
    name: 'Open For Workspace',
    updated_date: '',
  },
  enrollment: null,
  user_creator: { name: 'User Name' },
  count_missions: 10,
  count_pulses: 5,
  users_finished: 50,
  users_enrolled: 200,
  is_owner: true,
  enrolled: true,
};

describe('TrailDetailHelper', () => {
  const durationPipe = new KpDurationPipe();

  describe('buildResume', () => {
    const cases: any[] = [
      [null, [], undefined],
      [
        trailMock,
        [
          {
            label: 'GENERAL.DURATION',
            value: durationPipe.transform(trailMock.duration_time),
            icon: 'alarm',
          },
          {
            label: 'GENERAL.MISSIONS',
            value: trailMock.count_missions,
            icon: 'rocket_launch',
          },
          {
            label: 'GENERAL.PULSES',
            value: trailMock.count_pulses,
            svgIcon: 'pulse',
          },
          {
            label: 'GENERAL.ENROLLMENTS',
            value: trailMock.users_enrolled,
            icon: 'person',
          },
          {
            label: 'GENERAL.FINISHED',
            value: trailMock.users_finished,
            icon: 'school',
          },
        ],
        false,
      ],
      [
        trailMock,
        [
          {
            label: 'GENERAL.DURATION',
            value: durationPipe.transform(trailMock.duration_time),
            icon: 'alarm',
          },
          {
            label: 'GENERAL.MISSIONS',
            value: trailMock.count_missions,
            icon: 'rocket_launch',
          },
          {
            label: 'GENERAL.PULSES',
            value: trailMock.count_pulses,
            svgIcon: 'pulse',
          },
        ],
        true,
      ],
    ];

    test.each(cases)('for learning trail %p should return the resume value: %p', (trail, expectValue, isMobile) => {
      const resume = TrailDetailHelper.buildResume(trail, isMobile);
      expect(resume).toEqual(expectValue);
    });
  });

  describe('buildTitle', () => {
    const cases: any[] = [
      [null, undefined],
      [
        trailMock,
        {
          title: trailMock.name,
          createdDate: trailMock.created_date,
          creatorName: 'User Name',
          expirationDate: '2023-12-31',
          open: true,
        },
      ],
    ];

    test.each(cases)('for learning trail %p should return the title value: %p', (trail, expectValue) => {
      const resume = TrailDetailHelper.buildTitle(trail);
      expect(resume).toEqual(expectValue);
    });
  });
});
