import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpContentActivityTrackerWrapperComponent } from './kp-content-activity-tracker-wrapper.component';
import { KpCountdownControllerService } from '../../directives';
import { DOCUMENT } from '@angular/common';

describe('KpContentActivityTrackerWrapperComponent', () => {
  let component: KpContentActivityTrackerWrapperComponent;
  let fixture: ComponentFixture<KpContentActivityTrackerWrapperComponent>;
  let mockCountdownDirectiveController: jest.Mocked<KpCountdownControllerService>;
  let mockDocument: Document;

  beforeEach(async () => {
    mockCountdownDirectiveController = {
      pause: jest.fn(),
      resume: jest.fn(),
    } as unknown as jest.Mocked<KpCountdownControllerService>;

    await TestBed.configureTestingModule({
      imports: [KpContentActivityTrackerWrapperComponent],
      providers: [{ provide: KpCountdownControllerService, useValue: mockCountdownDirectiveController }],
    }).compileComponents();
    mockDocument = TestBed.inject(DOCUMENT);
  });

  beforeEach(() => {
    jest.useFakeTimers();
    fixture = TestBed.createComponent(KpContentActivityTrackerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display the inactivity overlay after more than 3 minutes', () => {
    jest.advanceTimersByTime(190000);

    expect(component.isPageDisabled).toBe(true);
  });

  it('should not display the inactivity overlay after more than 3 minutes if disableInactivityCheck is true', async () => {
    fixture.componentRef.setInput('disableInactivityCheck', true);

    jest.advanceTimersByTime(190000);

    expect(component.isPageDisabled).toBe(false);
  });

  describe('init', () => {
    it('should not emit activityEvent if disableActivityEvents is true', () => {
      const emitSpy = jest.spyOn(component.activityEvent, 'emit');
      fixture.componentRef.setInput('disableActivityEvents', true);
      fixture.detectChanges();

      component.init();

      expect(emitSpy).not.toHaveBeenCalled();
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

  describe('pause', () => {
    it('should call pause on the disableDirectiveControllerService', () => {
      jest.spyOn(mockDocument, 'hidden', 'get').mockReturnValueOnce(true);
      component.handleVisibilitychange();

      expect(mockCountdownDirectiveController.pause).toHaveBeenCalled();
    });
  });

  describe('continue', () => {
    it('should call resume on the disableDirectiveControllerService', () => {
      component.onContinue();

      expect(mockCountdownDirectiveController.resume).toHaveBeenCalled();
    });
  });

  describe('handleVisibilityChange', () => {
    it('it should resume activity events emission when the is visible and continueOnPageVisible is true', async () => {
      const emitSpy = jest.spyOn(component.activityEvent, 'emit');
      fixture.componentRef.setInput('continueOnPageVisible', true);
      fixture.detectChanges();
      jest.spyOn(mockDocument, 'hidden', 'get').mockReturnValueOnce(false);

      component.handleVisibilitychange();
      jest.advanceTimersByTime(6000);

      expect(emitSpy).toHaveBeenCalled();
      expect(mockCountdownDirectiveController.resume).toHaveBeenCalled();
    });
  });
});
