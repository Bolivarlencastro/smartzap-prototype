import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { constants } from '../../constants';
import { BehaviorSubject } from 'rxjs';
import { KpUserOnboardingService, VideoType } from './kp-user-onboarding.service';
import { KpUserOnboardingComponent } from '../../components/kp-user-onboarding/kp-user-onboarding.component';

describe('KpUserOnboardingService', () => {
  let service: KpUserOnboardingService;
  let dialogMock: jest.Mocked<MatDialog>;
  let breakpointSubject: BehaviorSubject<BreakpointState>;

  beforeEach(() => {
    dialogMock = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;

    breakpointSubject = new BehaviorSubject({
      matches: false,
      breakpoints: { [`(max-width: ${constants.defaultMobileWidth})`]: false },
    });

    const breakpointObserverMock = {
      observe: jest.fn().mockReturnValue(breakpointSubject.asObservable()),
    } as unknown as jest.Mocked<BreakpointObserver>;

    TestBed.configureTestingModule({
      providers: [
        KpUserOnboardingService,
        { provide: MatDialog, useValue: dialogMock },
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
    });

    service = TestBed.inject(KpUserOnboardingService);
  });

  afterEach(() => {
    localStorage.clear();
    jest.resetModules();
  });

  describe('openDialog', () => {
    describe('openDialog', () => {
      const cases: any[] = [
        ['events', 'https://assets.keepsdev.com/onboarding/Onboarding_Eventos/output.mpd'],
        ['missions', 'https://assets.keepsdev.com/onboarding/Onboarding_Missões/output.mpd'],
        ['learning-trails', 'https://assets.keepsdev.com/onboarding/Onboarding_Trilhas/output.mpd'],
        ['pulse', 'https://assets.keepsdev.com/onboarding/Onboarding_Pulses/output.mpd'],
        ['channel', 'https://assets.keepsdev.com/onboarding/Onboarding_Canal/output.mpd'],
        ['dashboard', 'https://assets.keepsdev.com/onboarding/Onboarding_Dashboard/output.mpd'],
        ['enrollments', 'https://assets.keepsdev.com/onboarding/Onboarding_Painel/output.mpd'],
        ['classroom', 'https://assets.keepsdev.com/onboarding/Onboarding_Classroom/output.mpd'],
      ];

      test.each(cases)('should return the correct url to video type: %p', (type, url) => {
        service.openDialog(type);
        expect(dialogMock.open).toHaveBeenCalledWith(KpUserOnboardingComponent, {
          data: url,
          width: '600px',
        });
      });
    });

    it('should not open dialog on mobile devices', () => {
      breakpointSubject.next({
        matches: true,
        breakpoints: { [`(max-width: ${constants.defaultMobileWidth})`]: true },
      });

      service.openDialog('missions');

      expect(dialogMock.open).not.toHaveBeenCalled();
    });

    it('should not open dialog when hideOnboardingTutorial is set to true', () => {
      const videoType: VideoType = 'missions';
      localStorage.setItem('hideOnboardingTutorial', 'true');

      service.openDialog(videoType);

      expect(dialogMock.open).not.toHaveBeenCalled();
    });

    it('should not open dialog if video URL is not found', () => {
      const invalidVideoType = 'invalid-type' as VideoType;
      localStorage.removeItem('hideOnboardingTutorial');

      service.openDialog(invalidVideoType);

      expect(dialogMock.open).not.toHaveBeenCalled();
    });
  });
});
