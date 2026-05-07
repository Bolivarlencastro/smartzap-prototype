import { KpPlayerActivityTrackerWrapperComponent } from './kp-player-activity-tracker-wrapper.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpCountdownControllerService } from '../../directives';

describe('KpPlayerActivityTrackerWrapperComponent', () => {
  let component: KpPlayerActivityTrackerWrapperComponent;
  let fixture: ComponentFixture<KpPlayerActivityTrackerWrapperComponent>;
  let activityEmitSpy: jest.SpyInstance;
  let countDownControllerMock: jest.Mocked<KpCountdownControllerService>;

  beforeEach(async () => {
    countDownControllerMock = {
      resume: jest.fn(),
      pause: jest.fn(),
    } as unknown as jest.Mocked<KpCountdownControllerService>;

    await TestBed.configureTestingModule({
      imports: [KpPlayerActivityTrackerWrapperComponent],
      providers: [{ provide: KpCountdownControllerService, useValue: countDownControllerMock }],
    }).compileComponents();
    jest.useFakeTimers();
    fixture = TestBed.createComponent(KpPlayerActivityTrackerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    activityEmitSpy = jest.spyOn(component.activityEvent, 'emit');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('init', () => {
    it('should not emit activityEvent if disableActivityEvents is true', () => {
      fixture.componentRef.setInput('disableActivityEvents', true);
      fixture.detectChanges();

      component.init();

      expect(activityEmitSpy).not.toHaveBeenCalled();
    });

    it('should not emit activityEvent if disableActivityEvents is true after every 5 seconds', async () => {
      const emitSpy = jest.spyOn(component.activityEvent, 'emit');
      fixture.componentRef.setInput('disableActivityEvents', true);
      fixture.detectChanges();

      component.init();
      jest.advanceTimersByTime(6000);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('play', () => {
    it('should call resume on the countdownController', () => {
      component.play();

      expect(countDownControllerMock.resume).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('should not emit activityEvent if disableActivityEvents is true', () => {
      const emitSpy = jest.spyOn(component.activityEvent, 'emit');
      fixture.componentRef.setInput('disableActivityEvents', true);
      fixture.detectChanges();

      component.pause();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should call pause on the countdownController', () => {
      component.pause();

      expect(countDownControllerMock.pause).toHaveBeenCalled();
    });
  });
});
