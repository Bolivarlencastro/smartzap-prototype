import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatButton } from '@angular/material/button';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'cp-support-material',
  imports: [MatButton, KpContentIconName, MatIcon, TranslocoPipe, MatTooltip],
  template: `
    @let items = this.materials();
    @if (items.length > 0) {
      <h2 class="text-2xl">{{ 'support-materials.title' | transloco }}</h2>
      <div class="flex gap-4 flex-wrap place-content-center">
        @for (material of materials(); track material.id) {
          <a [href]="material.content_url" target="_blank" matButton>
            <mat-icon class="s-6" [svgIcon]="material?.content_type_name | KpContentIconName"></mat-icon>
            <span [matTooltip]="material?.title" class="text-sm max-w-36 line-clamp-1 text-ellipsis">{{
              material.title
            }}</span>
          </a>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportMaterialComponent {
  materials = input<SupportMaterial[]>([]);
}
