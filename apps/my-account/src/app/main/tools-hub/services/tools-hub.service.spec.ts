import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyAccountV2API } from '@app/shared/api/myaccount-v2.api';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { ToolConfigDialogComponent } from '../components/tool-config-dialog/tool-config-dialog.component';
import { ToolsHubService } from './tools-hub.service';

describe('ToolsHubService', () => {
  let service: ToolsHubService;
  let dialogMock: jest.Mocked<MatDialog>;
  let myAccApiMock: jest.Mocked<MyAccountV2API>;

  beforeEach(() => {
    dialogMock = {
      open: jest.fn(
        () =>
          ({
            afterClosed: jest.fn().mockReturnValue(of(true)),
          }) as unknown as jest.Mocked<MatDialogRef<ToolConfigDialogComponent>>,
      ),
    } as unknown as jest.Mocked<MatDialog>;

    myAccApiMock = {
      get: jest.fn(() => of(EMPTY)),
      post: jest.fn(() => of(EMPTY)),
      patch: jest.fn(() => of(EMPTY)),
      delete: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<MyAccountV2API>;

    service = new ToolsHubService(myAccApiMock, dialogMock);
  });

  it('should load the tools', (done) => {
    service.getData().subscribe(() => {
      expect(myAccApiMock.get).toHaveBeenCalledWith('/custom-menu-items');
      done();
    });
  });

  it('should open tool config dialog', () => {
    const data: CustomMenuItem = { id: '123', name: 'Google', url: 'https://www.google.com', icon: 'search' };
    service.openConfigDialog(data);
    expect(dialogMock.open).toHaveBeenCalledWith(ToolConfigDialogComponent, { autoFocus: false, width: '350px', data });
  });

  it('should create a tool', (done) => {
    const item: Partial<CustomMenuItem> = { name: 'Google', url: 'https://www.google.com', icon: 'search' };
    service.create(item).subscribe(() => {
      expect(myAccApiMock.post).toHaveBeenCalledWith('/custom-menu-items', { ...item });
      done();
    });
  });

  it('should edit a tool', (done) => {
    const item: Partial<CustomMenuItem> = { id: '123', name: 'Google', url: 'https://www.google.com', icon: 'search' };
    service.edit(item).subscribe(() => {
      expect(myAccApiMock.patch).toHaveBeenCalledWith('/custom-menu-items/123', {
        name: 'Google',
        url: 'https://www.google.com',
        icon: 'search',
      });
      done();
    });
  });

  it('should remove a tool', (done) => {
    const id = '123';
    service.remove(id).subscribe(() => {
      expect(myAccApiMock.delete).toHaveBeenCalledWith('/custom-menu-items/123');
      done();
    });
  });
});
