import { Directive, HostBinding, Input } from '@angular/core';
import { WorkspaceBasicDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Directive({
  selector: '[kpWorkspaceAccentColor]',
  standalone: true,
})
export class WorkspaceAccentColorDirective {
  private readonly fallbackAccent = '#94a3b8';

  @HostBinding('style.border-bottom-style') borderBottomStyle = 'solid';
  @HostBinding('style.border-bottom-width') borderBottomWidth = '2px';
  @HostBinding('style.border-bottom-color') borderBottomColor = this.fallbackAccent;

  @Input('kpWorkspaceAccentColor') set workspace(workspace: WorkspaceBasicDto | null | undefined) {
    this.borderBottomColor = this.resolveColor(workspace);
  }

  private resolveColor(workspace: WorkspaceBasicDto | null | undefined): string {
    const workspaceAny = workspace as any;
    const color = workspaceAny?.custom_color || workspaceAny?.customColor;
    return typeof color === 'string' && color.trim() ? color.trim() : this.fallbackAccent;
  }
}
