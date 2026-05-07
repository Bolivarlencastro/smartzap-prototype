import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceBasicDto } from '@keeps-platform-frontend-workspace/kp-keeps';

import { WorkspacesListComponent } from './workspaces-list.component';

const mockWorkspace = {
  id: 'test',
  name: 'test_workspace',
  logo_url: 'test_logo',
  icon_url: '',
  hash_id: '',
  custom_color: '',
  theme_dark: false,
  logout_url: '',
  notify_teams: false,
  notify_slack: false,
} as WorkspaceBasicDto;

describe('WorkspacesListComponent', () => {
  let component: WorkspacesListComponent;
  let fixture: ComponentFixture<WorkspacesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspacesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should emit workspaceSelected', () => {
    const emitSpy = jest.spyOn(component.workspaceSelected, 'emit');

    component.selectWorkspace(mockWorkspace);

    expect(emitSpy).toHaveBeenCalledWith(mockWorkspace);
  });

  it('should return workspace id in trackBy', () => {
    expect(component.trackByWorkspaceId(0, mockWorkspace as any)).toBe('test');
  });

  it('should return undefined in trackBy when workspace is undefined', () => {
    expect(component.trackByWorkspaceId(0, undefined as unknown as WorkspaceBasicDto)).toBeUndefined();
  });

  it('should report copied reference state', async () => {
    jest.useFakeTimers();
    component.onWorkspaceReferenceCopied('copy-me', true);
    expect(component.isReferenceCopied('copy-me')).toBe(true);
    jest.advanceTimersByTime(1000);
    expect(component.isReferenceCopied('copy-me')).toBe(false);
  });

  it('should stop row selection when copy button is clicked', () => {
    const stopPropagation = jest.fn();
    component.stopRowSelection({ stopPropagation } as unknown as Event);

    expect(stopPropagation).toHaveBeenCalled();
  });

  it('should ignore copy feedback when cdk reports copy failure', () => {
    component.onWorkspaceReferenceCopied('copy-id', false);
    expect(component.isReferenceCopied('copy-id')).toBe(false);
  });

  it('should do nothing when no reference is available', () => {
    component.onWorkspaceReferenceCopied('', true);
    expect(component.isReferenceCopied('other')).toBe(false);
  });

  it('should clear pending timeout on destroy', () => {
    jest.useFakeTimers();
    component.onWorkspaceReferenceCopied('copy-id', true);

    component.ngOnDestroy();
    jest.advanceTimersByTime(2000);
    expect(component.isReferenceCopied('copy-id')).toBe(true);
  });

  it('should keep only latest copied reference feedback when called multiple times', () => {
    jest.useFakeTimers();
    component.onWorkspaceReferenceCopied('copy-id-1', true);
    jest.advanceTimersByTime(500);
    component.onWorkspaceReferenceCopied('copy-id-2', true);

    expect(component.isReferenceCopied('copy-id-1')).toBe(false);
    expect(component.isReferenceCopied('copy-id-2')).toBe(true);

    jest.advanceTimersByTime(1000);
    expect(component.isReferenceCopied('copy-id-2')).toBe(false);
  });
});
