import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  BehaviorSubject,
  filter,
  interval,
  map,
  scan,
  Subject,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  withLatestFrom,
} from 'rxjs';
import { KpCountdownControllerService } from './kp-countdown-controller.service';

export type KpCountdown = {
  timer: number;
  manualStart?: boolean;
};

export type KpCountdownContext = {
  $implicit: number;
  timer: number;
};

type Countdown = {
  remainingProgress: number;
  remainingTime: number;
};

@Directive({
  selector: '[kpCountdown]',
  standalone: true,
})
export class KpCountdownDirective implements OnInit, OnChanges, OnDestroy {
  static ngTemplateContextGuard(directive: KpCountdownDirective, context: unknown): context is KpCountdownContext {
    return true;
  }

  // We need to use an object as input because changes in primitive values won't trigger change detection if the same value is provided again
  // which prevents our timer subject from emitting a new value
  @Input() kpCountdown: KpCountdown;

  @Input() set kpCountdownSpeed(speed: number) {
    this.speedMultiplier.next(speed);
  }

  private unsubscribe = new Subject<void>();
  private timerSubject = new Subject<number>();
  private pauseSubject = new BehaviorSubject<boolean>(false);
  private currentContext: KpCountdownContext = { $implicit: 100, timer: 0 };
  private speedMultiplier = new BehaviorSubject(1);

  private static calculateProgress(totalTime: number, remainingTime: number): number {
    if (!remainingTime) {
      return 0;
    }
    return Math.round((remainingTime / totalTime) * 100);
  }

  constructor(
    private templateRef: TemplateRef<KpCountdownContext>,
    private viewContainer: ViewContainerRef,
    private countDownController: KpCountdownControllerService,
    private cdr: ChangeDetectorRef,
  ) {
    this.registerTimerSubject();
    this.registerControllerEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['kpCountdown'] && this.kpCountdown?.timer > -1) {
      this.updateCounterOnChange();
    }
  }

  ngOnInit() {
    this.createHostView(this.viewContainer, this.templateRef);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  pause() {
    this.pauseSubject.next(true);
  }

  resume() {
    this.pauseSubject.next(false);
  }

  setPlaybackSpeed(multiplier: number) {
    this.speedMultiplier.next(multiplier);
  }

  private updateCounterOnChange() {
    this.timerSubject.next(this.kpCountdown.timer);

    if (this.kpCountdown.manualStart) {
      this.enforceManualStart();
      return;
    }

    // If the last content used manual start, but was never resumed, we need to call resume to update
    // the pause subject
    this.resume();
  }

  private enforceManualStart() {
    this.pause();
    this.updateProgress({ remainingProgress: 100, remainingTime: Math.round(this.kpCountdown.timer) });
  }

  private registerTimerSubject(): void {
    this.timerSubject
      .asObservable()
      .pipe(
        map((duration) => duration),
        switchMap((value) => this.intervalCountdownFrom(value)),
        takeUntil(this.unsubscribe),
      )
      .subscribe((countdown) => this.updateProgress(countdown));
  }

  private intervalCountdownFrom(seconds: number) {
    const roundedSeconds = Math.round(seconds);
    const UPDATE_RATE_MS = 100;
    const EMISSIONS_PER_SECOND = 1000 / UPDATE_RATE_MS;
    const totalEvents = Math.round(roundedSeconds * EMISSIONS_PER_SECOND) || 1;

    return interval(UPDATE_RATE_MS).pipe(
      withLatestFrom(this.pauseSubject, this.speedMultiplier),
      filter(([_, paused]) => !paused),
      take(totalEvents),
      scan((remainingEvents, [_, _paused, speed]) => remainingEvents - speed, totalEvents),
      takeWhile((remainingEvents) => remainingEvents >= 0),
      map((remainingEvents) => remainingEvents / EMISSIONS_PER_SECOND),
      map((remainingTime) => ({
        remainingProgress: KpCountdownDirective.calculateProgress(roundedSeconds, remainingTime),
        remainingTime: Math.round(remainingTime),
      })),
    );
  }

  private updateProgress(countDown: Countdown): void {
    const { remainingProgress, remainingTime } = countDown;
    // Update current context properties because the object reference was already provided in the createEmbeddedView method
    this.currentContext.timer = remainingTime;
    this.currentContext.$implicit = remainingProgress;
    this.cdr.detectChanges();
  }

  private createHostView(viewContainer: ViewContainerRef, template: TemplateRef<KpCountdownContext>) {
    viewContainer.clear();
    viewContainer.createEmbeddedView(template, this.currentContext);
  }

  private registerControllerEvents() {
    this.countDownController.onPauseEvent.pipe(takeUntil(this.unsubscribe)).subscribe((paused) => {
      if (paused) {
        this.pause();
        return;
      }

      this.resume();
    });

    this.countDownController.onPlaybackSpeedChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((speed) => this.setPlaybackSpeed(speed));
  }
}
