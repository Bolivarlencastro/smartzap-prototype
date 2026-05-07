import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { Frame } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'ig-frame-options',
  imports: [MatIcon, TranslocoPipe],
  template: `
    <h2 class="mb-2">{{ 'IMAGE_WIZARD.FRAME_OPTIONS.SELECT_FRAME' | transloco }}</h2>
    <div class="grid grid-cols-2 gap-4">
      <button class="frame-item" [class.selected]="isSelected('')" (click)="selectFrame(null)">
        <div class="no-frame-option w-20 h-20 flex items-center justify-center">
          <mat-icon>block</mat-icon>
        </div>
        <span class="text-xs">{{ 'IMAGE_WIZARD.FRAME_OPTIONS.NO_FRAME' | transloco }}</span>
      </button>

      @for (frame of frameOptions(); track frame.id) {
        <button class="frame-item" [class.selected]="isSelected(frame.id)" (click)="selectFrame(frame)">
          <img [src]="frame.url" class="rounded-md h-20" [style.aspect-ratio]="aspectRatio()" />
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding: 16px;
      border-right: 1px solid var(--mat-sys-outline-variant);
    }

    .frame-item {
      cursor: pointer;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px;
      border: 2px solid transparent;
      transition: all 0.1s ease-in-out;
      text-align: center;

      .no-frame-option {
        border-radius: 8px;
        background-color: var(--mat-sys-surface-container-low);
      }

      &:hover,
      &:focus-within {
        background-color: var(--mat-sys-surface-container);
      }

      &.selected {
        background-color: var(--mat-sys-primary-container);
        border-color: var(--mat-sys-primary-fixed-dim);
        color: var(--mat-sys-on-primary-container);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameOptionsComponent {
  private selectedFrame = '';
  protected readonly aspectRatio = input<number>(0);
  readonly frameSelected = output<string>();
  readonly frameOptions = input<Frame[]>([]);

  selectFrame(frame?: Frame) {
    this.selectedFrame = frame?.id ?? '';
    this.frameSelected.emit(frame?.url ?? undefined);
  }

  isSelected(frameId: string) {
    return this.selectedFrame === frameId;
  }
}
