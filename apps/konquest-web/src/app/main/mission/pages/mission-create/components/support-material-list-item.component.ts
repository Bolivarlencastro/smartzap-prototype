import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'app-support-material-list-item',
  imports: [MatIcon, MatIconButton, KpContentIconName, MatTooltip, TranslocoPipe],
  template: `
    @let material = supportMaterial();
    <mat-icon class="s-6" [svgIcon]="material?.content_type_name | KpContentIconName"></mat-icon>
    <p class="[word-break:break-word] line-clamp-1">{{ material?.title }}</p>

    <button matIconButton class="ml-auto" (click)="onDelete()" [matTooltip]="'GENERAL.DELETE' | transloco">
      <mat-icon>delete</mat-icon>
    </button>
  `,
  styles: `
    :host {
      margin-top: 1rem;
      display: flex;
      padding: 1rem;
      align-items: center;
      gap: 1rem;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 0.5rem;
      background-color: var(--mat-sys-surface-container-low);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportMaterialListItemComponent {
  supportMaterial = input<SupportMaterial>();
  delete = output<void>();

  onDelete() {
    this.delete.emit();
  }
}
