import { WorkspaceBasicDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { WorkspaceInitialPipe, WorkspaceLogoPipe, WorkspaceReferencePipe } from './workspace-presentation.pipes';

describe('WorkspacePresentationPipes', () => {
  const workspaceDto = (overrides: Partial<WorkspaceBasicDto> = {}): WorkspaceBasicDto => ({
    id: 'workspace-id',
    name: 'Workspace',
    logo_url: '',
    icon_url: '',
    hash_id: '',
    custom_color: '',
    theme_dark: false,
    logout_url: '',
    notify_teams: false,
    notify_slack: false,
    ...overrides,
  });

  it('should resolve workspace logo with fallback chain', () => {
    const pipe = new WorkspaceLogoPipe();
    expect(pipe.transform(workspaceDto({ logo_url: 'logo-url' }))).toBe('logo-url');
    expect(pipe.transform(workspaceDto({ logo_url: '', icon_url: 'icon-url' }))).toBe('icon-url');
    expect(pipe.transform(workspaceDto())).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should resolve workspace reference with fallback chain', () => {
    const pipe = new WorkspaceReferencePipe();
    expect(pipe.transform(workspaceDto({ id: 'workspace-id', hash_id: 'hash-ref' }))).toBe('hash-ref');
    expect(pipe.transform(workspaceDto({ id: 'workspace-id', hash_id: '' }))).toBe('workspace-id');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should resolve workspace initial from workspace name', () => {
    const pipe = new WorkspaceInitialPipe();
    expect(pipe.transform(workspaceDto({ name: 'workspace' }))).toBe('W');
    expect(pipe.transform(workspaceDto({ name: '  alpha' }))).toBe('A');
    expect(pipe.transform(workspaceDto({ name: '' }))).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
