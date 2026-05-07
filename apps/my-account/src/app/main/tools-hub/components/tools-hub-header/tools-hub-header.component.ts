import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-tools-hub-header',
  imports: [TranslocoModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="w-full h-32 px-6 flex items-center justify-between">
      <span class="text-2xl font-semibold">{{ 'TOOLS_HUB.TITLE' | transloco }}</span>
      <button mat-flat-button color="primary" class="flex gap-1" (click)="onCreate()">
        <mat-icon>add</mat-icon>
        <span>{{ 'TOOLS_HUB.CREATE_BUTTON' | transloco }}</span>
      </button>
    </div>
    <mat-divider></mat-divider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsHubHeaderComponent {
  create = output<void>();

  onCreate() {
    this.create.emit();
  }
}
