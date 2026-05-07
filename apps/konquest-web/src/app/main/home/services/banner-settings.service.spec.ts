import { MatDialog } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import { SearchAPI } from '@core/api/base/search.api';
import { LearnContentsApi, MyAccountV2Client, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { BannerSettingsComponent } from '../containers/banner-settings/banner-settings.component';
import { CustomSettings } from '../models/banner-settings';
import { BannerSettingsService } from './banner-settings.service';

describe('BannerSettingsService', () => {
  let service: BannerSettingsService;
  let dialogMock: jest.Mocked<MatDialog>;
  let myAccApiMock: jest.Mocked<MyAccountV2Client>;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let searchApiMock: jest.Mocked<SearchAPI>;
  let workspaceMock: jest.Mocked<WorkspaceService>;
  let contentsApiMock: jest.Mocked<LearnContentsApi>;

  beforeEach(() => {
    dialogMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    myAccApiMock = {
      get: jest.fn(() => of(EMPTY)),
      post: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<MyAccountV2Client>;

    konquestApiMock = {
      get: jest.fn(() => of(EMPTY)),
      post: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<KonquestAPI>;

    searchApiMock = {
      get: jest.fn(() => of({ items: [] })),
    } as unknown as jest.Mocked<SearchAPI>;

    workspaceMock = {
      currentWorkspaceId: '123',
    } as unknown as jest.Mocked<WorkspaceService>;

    contentsApiMock = {
      saveCoverWithSize: jest.fn(),
    } as unknown as jest.Mocked<LearnContentsApi>;

    service = new BannerSettingsService(
      dialogMock,
      myAccApiMock,
      konquestApiMock,
      searchApiMock,
      workspaceMock,
      contentsApiMock,
    );
  });

  it('should open banner settings dialog', () => {
    service.openDialog();

    expect(dialogMock.open).toHaveBeenCalledWith(BannerSettingsComponent, {
      autoFocus: 'dialog',
      disableClose: true,
      panelClass: 'custom-banner-dialog-container',
    });
  });

  it('should load initial banner mode', (done) => {
    myAccApiMock.get.mockReturnValueOnce(of({ banner_mode: true }));

    service.loadMode().subscribe(() => {
      expect(myAccApiMock.get).toHaveBeenCalledWith(`/workspaces/123/banner-mode`);
      done();
    });
  });

  it('should load custom settings when banner initial mode is MANUAL', (done) => {
    konquestApiMock.get.mockReturnValueOnce(
      of({
        start_date: null,
        end_date: null,
        learning_resources: [
          { resource_type: 'LEARNING_TRAIL' },
          { resource_type: 'EVENT' },
          { resource_type: 'COURSE' },
        ],
      }),
    );

    service.loadCustomSettings().subscribe((res) => {
      expect(konquestApiMock.get).toHaveBeenCalledWith(`/banners`);
      expect(res.learning_resources).toEqual([
        { resource_type: 'LEARNING_TRAIL', icon: 'route' },
        { resource_type: 'EVENT', icon: 'event' },
        { resource_type: 'COURSE', icon: 'rocket_launch' },
      ]);

      done();
    });
  });

  it('should save the banner mode', (done) => {
    const banner_mode = 'MANUAL';

    service.saveMode(banner_mode).subscribe(() => {
      expect(myAccApiMock.post).toHaveBeenCalledWith('/workspaces/123/banner-mode', { banner_mode });
      done();
    });
  });

  it('should load the internal contents', (done) => {
    const search = 'test';

    service.loadInternalContents(search).subscribe(() => {
      expect(searchApiMock.get).toHaveBeenCalledWith('/v1/global', {
        page: 1,
        per_page: 15,
        search,
        dataType: ['courses', 'trails'],
        development_status: ['DONE'],
      });

      done();
    });
  });

  it('should publish manual banners', (done) => {
    contentsApiMock.saveCoverWithSize.mockReturnValueOnce(of({ url: 'https://www.alura.com.br' }));

    const fileMock = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const settings = {
      start_date: null,
      end_date: null,
      learning_resources: [
        { resource_type: 'EXTERNAL_CONTENT', external_resource_image: 'https://www.google.com' },
        {
          resource_type: 'EXTERNAL_CONTENT',
          external_resource_image: fileMock,
        },
        { resource_type: 'COURSE', resource_id: '123' },
      ],
    } as CustomSettings;

    service.publish(settings).subscribe(() => {
      expect(contentsApiMock.saveCoverWithSize).toHaveBeenCalledWith(fileMock, 1920, 640);
      expect(konquestApiMock.post).toHaveBeenCalledWith('/banners', {
        start_date: null,
        end_date: null,
        learning_resources: [
          { resource_type: 'EXTERNAL_CONTENT', external_resource_image: 'https://www.google.com', order: 0 },
          {
            resource_type: 'EXTERNAL_CONTENT',
            external_resource_image: 'https://www.alura.com.br',
            order: 1,
          },
          { resource_type: 'COURSE', resource_id: '123', order: 2 },
        ],
        is_temporary: false,
      });

      done();
    });
  });
});
