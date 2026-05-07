import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { concatMap, defer, delay, filter, from, interval, last, map, of, repeat, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'kp-chatbot-loading',
  standalone: true,
  imports: [KpSkeletonComponent],
  template: `
    <div
      class="flex flex-col items-center justify-center w-full h-full space-y-8 animate-fade-in bg-white/90 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center justify-center min-h-[5rem]">
        <span class="text-xl font-medium text-slate-700 typing-effect">
          {{ currentText() }}
        </span>

        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>

      <div class="w-full max-w-2xl px-4 space-y-6 opacity-60">
        <div class="flex items-end gap-1.5">
          <kp-skeleton class="circle-skeleton"></kp-skeleton>
          <div class="flex flex-col gap-2">
            <kp-skeleton class="rect-skeleton w-48"></kp-skeleton>
            <kp-skeleton class="rect-skeleton w-72"></kp-skeleton>
          </div>
        </div>

        <div class="flex items-end gap-1.5 justify-end">
          <kp-skeleton class="rect-skeleton w-64"></kp-skeleton>
          <kp-skeleton class="circle-skeleton"></kp-skeleton>
        </div>

        <div class="flex items-end gap-1.5">
          <kp-skeleton class="circle-skeleton"></kp-skeleton>
          <div class="flex flex-col gap-2">
            <kp-skeleton class="rect-skeleton w-56"></kp-skeleton>
            <kp-skeleton class="rect-skeleton w-80"></kp-skeleton>
            <kp-skeleton class="rect-skeleton w-40"></kp-skeleton>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .typing-effect::after {
        content: '|';
        margin-left: 2px;
        animation: blink 1s step-end infinite;
      }

      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }

      .animate-fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .progress-bar {
        width: 250px;
        height: 2px;
        background-color: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        margin: 16px 0 12px;
      }

      .progress-fill {
        height: 100%;
        background-color: var(--mat-sys-primary, #3b82f6);
        width: 0%;
        animation: progress-load 5s ease-out forwards;
      }

      @keyframes progress-load {
        to {
          width: 98%;
        }
      }

      .circle-skeleton {
        @apply w-8 h-8 rounded-full;
        background-color: var(--mat-sys-outline-variant);
      }

      .rect-skeleton {
        @apply h-4;
        background-color: var(--mat-sys-outline-variant);
      }
    `,
  ],
})
export class ChatbotLoadingComponent implements OnInit {
  readonly currentText = signal('');

  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.startLoadingCycle();
  }

  private startLoadingCycle() {
    interval(100)
      .pipe(
        map(() => this.transloco.translateObject('CHATBOT.LOADING')),
        filter((t) => !!t),
        take(1),
        map((t) => Object.values(t) as string[]),
        switchMap((messages) => this.typingAnimation$(messages)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private typingAnimation$(messages: string[]) {
    return from(messages).pipe(
      concatMap((message) => this.typeSentence(message)),
      repeat(),
    );
  }

  private typeSentence(sentence: string) {
    return defer(() => {
      this.currentText.set('');

      return from(sentence.split('')).pipe(
        concatMap((char) => of(char).pipe(delay(50))),
        tap((char) => {
          this.currentText.update((val) => val + char);
        }),
        last(),
        delay(2000),
      );
    });
  }
}
