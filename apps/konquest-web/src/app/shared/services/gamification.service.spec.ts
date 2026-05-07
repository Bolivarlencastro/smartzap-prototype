import { TestBed } from '@angular/core/testing';
import { ApplicationServicesApi, GamificationApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { GamificationService } from './gamification.service';

describe('GamificationService', () => {
  let service: GamificationService;
  let messageService: KpMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GamificationService,
        { provide: KpMessageService, useValue: { success: jest.fn() } },
        {
          provide: GamificationApi,
          useValue: {
            getGamificationSubModules: jest.fn(),
            getGeneralRanking: jest.fn(),
            getStatisticsUser: jest.fn(),
            updateGamificationSubModule: jest.fn(() => of(EMPTY)),
          },
        },
        { provide: ApplicationServicesApi, useValue: { getApplicationServices: jest.fn() } },
      ],
    });

    service = TestBed.inject(GamificationService);
    messageService = TestBed.inject<KpMessageService>(KpMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateGamificationMessage', () => {
    const cases: any[] = [
      [
        { id: '1', field: 'ranking_multiplier', ranking: 'multiplier' },
        true,
        'GAMIFICATION.SUCCESS_MESSAGE.MULTIPLIER_RANKING.ENABLED',
      ],
      [
        { id: '1', field: 'ranking_multiplier', ranking: 'multiplier' },
        false,
        'GAMIFICATION.SUCCESS_MESSAGE.MULTIPLIER_RANKING.DISABLED',
      ],
      [
        { id: '2', field: 'ranking_director', ranking: 'director' },
        true,
        'GAMIFICATION.SUCCESS_MESSAGE.RANKING_BY_BOARD.ENABLED',
      ],
      [
        { id: '2', field: 'ranking_director', ranking: 'director' },
        false,
        'GAMIFICATION.SUCCESS_MESSAGE.RANKING_BY_BOARD.DISABLED',
      ],
      [
        { id: '3', field: 'ranking_manager', ranking: 'manager' },
        true,
        'GAMIFICATION.SUCCESS_MESSAGE.RANKING_BY_SUB_DIRECTORATE.ENABLED',
      ],
      [
        { id: '3', field: 'ranking_manager', ranking: 'manager' },
        false,
        'GAMIFICATION.SUCCESS_MESSAGE.RANKING_BY_SUB_DIRECTORATE.DISABLED',
      ],
      [
        { id: '4', field: 'ranking_activity_area', ranking: 'activity_area' },
        true,
        'GAMIFICATION.SUCCESS_MESSAGE.RANKING_BY_AREA.ENABLED',
      ],
      [
        { id: '4', field: 'ranking_activity_area', ranking: 'activity_area' },
        false,
        'GAMIFICATION.SUCCESS_MESSAGE.RANKING_BY_AREA.DISABLED',
      ],
      [
        { id: '5', field: 'ranking_leader', ranking: 'leader' },
        true,
        'GAMIFICATION.SUCCESS_MESSAGE.RANKING_BY_LEADERSHIP.ENABLED',
      ],
      [
        { id: '5', field: 'ranking_leader', ranking: 'leader' },
        false,
        'GAMIFICATION.SUCCESS_MESSAGE.RANKING_BY_LEADERSHIP.DISABLED',
      ],
    ];

    test.each(cases)(
      'for field " %p " and the value " %p ", should return this message: %p',
      (item, value, message, done: any) => {
        const successSpy = jest.spyOn(messageService, 'success');
        service.updateGamificationSubModules(item, value).subscribe(() => {
          expect(successSpy).toHaveBeenCalledWith(message);
          done();
        });
      },
    );
  });
});
