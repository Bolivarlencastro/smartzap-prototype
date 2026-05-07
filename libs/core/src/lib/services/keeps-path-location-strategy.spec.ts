import { PlatformLocation } from '@angular/common';
import { Workspace } from '../my-account-sdk';

import { KeepsPathLocationStrategy } from './keeps-path-location-strategy';
import { WorkspaceService } from './workspace.service';

const mockWorkspace = {
  id: 'test',
  hash_id: 'mock_hash_id',
  name: 'test_workspace',
  logo_url: 'test_logo',
} as Workspace;

describe('KeepsPathLocationStrategyService', () => {
  let service: KeepsPathLocationStrategy;

  const platformLocationMock: jest.Mocked<PlatformLocation> = {
    getBaseHrefFromDOM: jest.fn().mockReturnValue('/'),
    joinWithSlash: jest.fn(),
  } as any;

  const workspaceServiceMock: jest.Mocked<WorkspaceService> = {
    getCurrentWorkspace: jest.fn().mockReturnValue(mockWorkspace),
  } as any;

  beforeEach(() => {
    service = new KeepsPathLocationStrategy(platformLocationMock, workspaceServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBaseHref', () => {
    it('should return the baseHref containing the workspace hash_id when the workspace is set', () => {
      const expectedBaseHref = `/${mockWorkspace.hash_id}/`;

      expect(service.getBaseHref()).toBe(expectedBaseHref);
    });

    it('should return the default baseHref when the workspace is not set', () => {
      workspaceServiceMock.getCurrentWorkspace.mockReturnValue(undefined);

      expect(service.getBaseHref()).toBe('/');
    });

    it('should return the existing baseHref when its already set but the workspace is not', () => {
      jest.spyOn(service, 'path').mockReturnValue('/ZTc2YjUw/dashboard');
      workspaceServiceMock.getCurrentWorkspace.mockReturnValue(undefined);

      expect(service.getBaseHref()).toBe('/ZTc2YjUw/');
    });
  });

  describe('getHashFromUrl', () => {
    it('should return the base href from the current path without slashes', () => {
      jest.spyOn(service, 'path').mockReturnValue('/ZTc2YjUw/dashboard');

      expect(service.getHashFromUrl()).toBe('ZTc2YjUw');
    });
  });
});
