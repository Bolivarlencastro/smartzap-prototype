import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpCountdownControllerService } from './kp-countdown-controller.service';
import { KpCountdown, KpCountdownDirective } from './kp-countdown.directive';

function getElementValue(elementId: string, fixture: ComponentFixture<TestHostComponent>): string {
  return fixture.nativeElement.querySelector(elementId).textContent;
}

describe('KpCountdownDirective', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let countDownDirectiveController: KpCountdownControllerService;

  beforeEach(async () => {
    jest.useFakeTimers();

    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [KpCountdownDirective],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    countDownDirectiveController = TestBed.inject(KpCountdownControllerService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create an instance', () => {
    expect(hostComponent).toBeTruthy();
    expect(hostComponent.countdownDirective).toBeTruthy();
  });

  it('should countdown until both timer and progress are zero', async () => {
    jest.advanceTimersByTime(11000);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('0');
    expect(progress).toBe('0');
  });

  it('should countdown until both timer and progress are zero even if the time is a float value', async () => {
    hostComponent.countdown = { timer: 10.5 };
    hostFixture.detectChanges();

    jest.advanceTimersByTime(12000);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('0');
    expect(progress).toBe('0');
  });

  it('should pause the countdown', async () => {
    jest.advanceTimersByTime(5000);
    hostComponent.countdownDirective.pause();

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('5');
    expect(progress).toBe('50');
  });

  it('should not start the countdown if manualStart is true', async () => {
    hostComponent.countdown = { timer: 10, manualStart: true };
    hostFixture.detectChanges();

    jest.advanceTimersByTime(11000);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('10');
    expect(progress).toBe('100');
  });

  it('should countdown after resume if manualStart is true', async () => {
    hostComponent.countdown = { timer: 10, manualStart: true };
    hostFixture.detectChanges();

    jest.advanceTimersByTime(11000);
    hostComponent.countdownDirective.resume();
    jest.advanceTimersByTime(11000);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('0');
    expect(progress).toBe('0');
  });

  it('should update the countdown if it is in progress', async () => {
    hostComponent.countdown = { timer: 20 };
    hostFixture.detectChanges();

    jest.advanceTimersByTime(10000);
    hostComponent.countdown = { timer: 50 };
    hostFixture.detectChanges();
    jest.advanceTimersByTime(10000);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('40');
    expect(progress).toBe('80');
  });

  it('should pause the countdown if it gets updated to zero', async () => {
    hostComponent.countdown = { timer: 20 };
    hostFixture.detectChanges();

    jest.advanceTimersByTime(10000);
    hostComponent.countdown = { timer: 0 };
    hostFixture.detectChanges();
    jest.advanceTimersByTime(100);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('0');
    expect(progress).toBe('0');
  });

  it('should pause the countdown via controller event', async () => {
    jest.advanceTimersByTime(5000);
    countDownDirectiveController.pause();

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('5');
    expect(progress).toBe('50');
  });

  it('should resume the countdown', async () => {
    jest.advanceTimersByTime(5000);
    hostComponent.countdownDirective.pause();
    hostComponent.countdownDirective.resume();
    jest.advanceTimersByTime(2500);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('3');
    expect(progress).toBe('25');
  });

  it('should resume the countdown via controller event', async () => {
    jest.advanceTimersByTime(5000);
    countDownDirectiveController.pause();
    countDownDirectiveController.resume();
    jest.advanceTimersByTime(2500);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('3');
    expect(progress).toBe('25');
  });

  it('should multiply the speed of the countdown', async () => {
    jest.advanceTimersByTime(5000);
    hostComponent.countdownDirective.setPlaybackSpeed(2);
    hostFixture.detectChanges();
    jest.advanceTimersByTime(2500);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('0');
    expect(progress).toBe('0');
  });

  it('should multiply the speed of the countdown via the controller', async () => {
    jest.advanceTimersByTime(5000);
    countDownDirectiveController.setPlaybackSpeed(2);
    hostFixture.detectChanges();
    jest.advanceTimersByTime(2500);

    hostFixture.detectChanges();
    const timer = getElementValue('#timer', hostFixture);
    const progress = getElementValue('#progress', hostFixture);

    expect(timer).toBe('0');
    expect(progress).toBe('0');
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-host-component',
  standalone: false,
  template: `
    <ng-container *kpCountdown="countdown; let progress; let t = timer">
      <span id="progress">{{ progress }}</span>
      <span id="timer">{{ t }}</span>
    </ng-container>
  `,
})
class TestHostComponent {
  @ViewChild(KpCountdownDirective) countdownDirective: KpCountdownDirective;
  countdown: KpCountdown = { timer: 10 };
}
