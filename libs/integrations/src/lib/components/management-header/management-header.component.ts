import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { getTranslocoScope } from '../../utils';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kp-alura-management-header',
  imports: [TranslocoModule, MatButtonModule, MatIconModule],
  template: `
    <div class="h-32 px-7 flex items-center justify-between bg-card">
      <span class="text-2xl font-bold">Alura</span>
      <div class="flex items-center gap-1">
        <button mat-flat-button color="primary" class="h-10" (click)="onOpenCourseMirrorDialog()">
          <mat-icon>add</mat-icon>
          <span class="ml-2.5"> {{ 'INTEGRATIONS.MANAGEMENT_HEADER.MIRROR_COURSES' | transloco }} </span>
        </button>
        <div class="border rounded-full">
          <a mat-icon-button (click)="onOpenTokensConfigDialog()">
            <mat-icon class="s-7">settings</mat-icon>
          </a>
        </div>
      </div>
    </div>
  `,
  providers: [getTranslocoScope()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementHeaderComponent {
  @Output() configureToken = new EventEmitter<void>();
  @Output() courseMirrorDialog = new EventEmitter<void>();

  onOpenTokensConfigDialog(): void {
    this.configureToken.emit();
  }

  onOpenCourseMirrorDialog(): void {
    this.courseMirrorDialog.emit();
  }
}
