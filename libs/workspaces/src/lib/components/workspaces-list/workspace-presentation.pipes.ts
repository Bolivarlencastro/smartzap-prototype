import { Pipe, PipeTransform } from '@angular/core';
import { WorkspaceBasicDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Pipe({
  name: 'workspaceLogo',
  standalone: true,
  pure: true,
})
export class WorkspaceLogoPipe implements PipeTransform {
  transform(workspace: WorkspaceBasicDto | null | undefined): string {
    return workspace?.logo_url || workspace?.icon_url || '';
  }
}

@Pipe({
  name: 'workspaceReference',
  standalone: true,
  pure: true,
})
export class WorkspaceReferencePipe implements PipeTransform {
  transform(workspace: WorkspaceBasicDto | null | undefined): string {
    return workspace?.hash_id || workspace?.id || '';
  }
}

@Pipe({
  name: 'workspaceInitial',
  standalone: true,
  pure: true,
})
export class WorkspaceInitialPipe implements PipeTransform {
  transform(workspace: WorkspaceBasicDto | null | undefined): string {
    const workspaceName = workspace?.name || '';
    return workspaceName.trim().charAt(0).toUpperCase();
  }
}
