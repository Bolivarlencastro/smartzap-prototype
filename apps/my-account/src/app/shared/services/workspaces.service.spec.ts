import { Router } from '@angular/router';
import { ThemingService, Workspace, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';
import { of } from 'rxjs';
import { WorkspacesService } from './workspaces.service';

describe('WorkspacesService', () => {
  let httpV2Mock: jest.Mocked<MyAccountV2API>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let routerMock: jest.Mocked<Router>;
  let themingServiceMock: jest.Mocked<ThemingService>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  let service: WorkspacesService;

  const sampleWorkspace: Workspace = {
    id: 'w-1',
    name: 'Acme',
    description: 'desc',
    address: 'addr',
    city: 'city',
    state: 'st',
    country: 'BR',
    post_code: '00000-000',
    theme_dark: false,
    custom_color: '#112233',
    doc_number: '123',
    duns_number: '456',
    hash_id: 'hash-1',
    icon_url: '',
    logo_url: '',
  } as unknown as Workspace; // allow partials tolerated by app types

  beforeEach(() => {
    httpV2Mock = {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      postFormData: jest.fn(),
    } as unknown as jest.Mocked<MyAccountV2API>;

    workspaceServiceMock = {
      clearCurrentWorkspace: jest.fn(),
      setCurrentWorkspace: jest.fn(),
    } as unknown as jest.Mocked<WorkspaceService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    themingServiceMock = {
      setThemeColor: jest.fn(),
    } as unknown as jest.Mocked<ThemingService>;

    messageServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    service = new WorkspacesService(
      httpV2Mock,
      workspaceServiceMock,
      routerMock,
      themingServiceMock,
      messageServiceMock,
    );
  });

  it('removeCurrentWorkspace should clear current workspace via WorkspaceService', () => {
    service.removeCurrentWorkspace();
    expect(workspaceServiceMock.clearCurrentWorkspace).toHaveBeenCalled();
  });

  describe('uploadWorkspaceImage', () => {
    it('should upload image and update workspace (icon), then set current workspace', (done) => {
      const file = new Blob(['x'], { type: 'image/png' }) as any as File;
      const dto = { workspaceId: 'w-1', file, type: 'icon' as const };
      const uploaded = { name: 'icon.png', url: 'https://assets/icon.png' };
      const updatedWorkspace = { ...sampleWorkspace, icon_url: uploaded.url } as Workspace;

      httpV2Mock.postFormData.mockReturnValue(of(uploaded));
      httpV2Mock.patch.mockReturnValue(of(updatedWorkspace));

      service.uploadWorkspaceImage(dto).subscribe((res) => {
        expect(httpV2Mock.postFormData).toHaveBeenCalled();
        const [url, form] = httpV2Mock.postFormData.mock.calls[0];
        expect(url).toBe(`/workspaces/icon`);
        expect(form).toBeInstanceOf(FormData);
        // Validate FormData contains width/height and file
        const width = (form as FormData).get('width');
        const height = (form as FormData).get('height');
        const sentFile = (form as FormData).get('file');
        expect(width).toBe('200');
        expect(height).toBe('200');
        expect(sentFile).toBeTruthy();

        expect(httpV2Mock.patch).toHaveBeenCalledWith(`/workspaces/${dto.workspaceId}`, { icon_url: uploaded.url });
        expect(workspaceServiceMock.setCurrentWorkspace).toHaveBeenCalledWith(updatedWorkspace);
        expect(res).toEqual(updatedWorkspace);
        done();
      });
    });
  });

  describe('createWorkspace', () => {
    it('should create workspace, set it as current and navigate to profile', (done) => {
      httpV2Mock.post.mockReturnValue(of(sampleWorkspace));

      service.createWorkspace(sampleWorkspace).subscribe((w) => {
        expect(httpV2Mock.post).toHaveBeenCalledWith('/workspaces', sampleWorkspace);
        expect(workspaceServiceMock.setCurrentWorkspace).toHaveBeenCalledWith(sampleWorkspace);
        expect(routerMock.navigate).toHaveBeenCalledWith(['workspace', 'profile']);
        expect(w).toEqual(sampleWorkspace);
        done();
      });
    });
  });

  describe('updateWorkspace', () => {
    it('should patch allowed fields and set current workspace', (done) => {
      const changed: Workspace = { ...sampleWorkspace, name: 'New Name' } as Workspace;
      httpV2Mock.patch.mockReturnValue(of(changed));

      service.updateWorkspace(changed).subscribe((w) => {
        expect(httpV2Mock.patch).toHaveBeenCalledWith(
          `/workspaces/${changed.id}`,
          expect.objectContaining({
            theme_dark: changed.theme_dark,
            custom_color: changed.custom_color,
            name: changed.name,
            doc_number: changed.doc_number,
            duns_number: changed.duns_number,
            description: changed.description,
            address: changed.address,
            city: changed.city,
            state: changed.state,
            post_code: changed.post_code,
            country: changed.country,
          }),
        );
        expect(workspaceServiceMock.setCurrentWorkspace).toHaveBeenCalledWith(changed);
        expect(w).toEqual(changed);
        expect(messageServiceMock.success).toHaveBeenCalledWith('GENERAL.CONFIGURATIONS_UPDATED');
        expect(messageServiceMock.error).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('theming helpers', () => {
    it('updateWorkspaceCustomColor should update and call theming with new color and existing theme_dark', (done) => {
      const newColor = '#abcdef';
      const payload = { ...sampleWorkspace, custom_color: newColor } as Workspace;
      httpV2Mock.patch.mockReturnValue(of(payload));

      service.updateWorkspaceCustomColor(newColor, sampleWorkspace).subscribe(() => {
        expect(httpV2Mock.patch).toHaveBeenCalled();
        expect(themingServiceMock.setThemeColor).toHaveBeenCalledWith(newColor, sampleWorkspace.theme_dark);
        done();
      });
    });

    it('updateWorkspaceDarkTheme should update and call theming with current color and new theme', (done) => {
      const newTheme = true;
      const payload = { ...sampleWorkspace, theme_dark: newTheme } as Workspace;
      httpV2Mock.patch.mockReturnValue(of(payload));

      service.updateWorkspaceDarkTheme(newTheme, sampleWorkspace).subscribe(() => {
        expect(httpV2Mock.patch).toHaveBeenCalled();
        expect(themingServiceMock.setThemeColor).toHaveBeenCalledWith(sampleWorkspace.custom_color, newTheme);
        done();
      });
    });
  });

  describe('deleteWorkspace', () => {
    it('should delete workspace, clear current and navigate to "/workspaces"', (done) => {
      httpV2Mock.delete.mockReturnValue(of({} as any));

      service.deleteWorkspace('w-1').subscribe(() => {
        expect(httpV2Mock.delete).toHaveBeenCalledWith('/workspaces/w-1');
        expect(workspaceServiceMock.clearCurrentWorkspace).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'workspaces']);
        done();
      });
    });
  });
});
