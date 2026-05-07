import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';

@Component({
  selector: 'lp-dialog-user-item',
  imports: [KpCardTagComponent],
  template: `
    <img class="rounded-full h-8 w-8" [src]="avatar() || defaultUserAvatar" alt="User Avatar" />

    <div class="flex flex-col">
      <span class="text-sm [word-break:break-word] line-clamp-1 font-bold">{{ name() }}</span>

      @if (jobPosition()) {
        <span class="text-2xxs [word-break:break-word] line-clamp-1 opacity-70">{{ jobPosition() }}</span>
      }

      @if (isNormative()) {
        <kp-card-tag class="w-fit" [type]="'modifier-normative'" [keepOpen]="true"></kp-card-tag>
      }

      @if (isRequired()) {
        <kp-card-tag class="w-fit" [type]="'modifier-required'" [keepOpen]="true"></kp-card-tag>
      }
    </div>

    <div class="ml-auto flex items-center gap-2">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        height: 3.25rem;
        padding: 0.7rem;
        gap: 0.75rem;
        background-color: var(--mat-sys-surface-container-low);
        border-radius: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUserItemComponent {
  name = input<string>();
  avatar = input<string>();
  jobPosition = input<string>();
  isNormative = input<boolean>(false);
  isRequired = input<boolean>(false);

  protected readonly defaultUserAvatar = constants.defaultUserAvatar;
}
